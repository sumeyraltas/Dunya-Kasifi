import { COUNTRIES } from '../data/countries.ts';
import { WORLD_MAP_PATHS } from '../data/worldMapSvg.ts';
import { CapitalQuizSubMode, Country, Difficulty, GameMode, QuizQuestion } from '../types.ts';

// Shuffle helper
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Filter countries by difficulty
export function getFilteredCountries(difficulty: Difficulty, forMap: boolean = false): Country[] {
  let pool = COUNTRIES;

  if (forMap) {
    // Only countries that exist in the SVG map dataset
    pool = pool.filter(c => !!WORLD_MAP_PATHS[c.code]);
  }

  if (difficulty === 'easy') {
    const easyList = pool.filter(c => c.difficulty === 'easy');
    return easyList.length >= 8 ? easyList : pool;
  } else if (difficulty === 'medium') {
    const medList = pool.filter(c => c.difficulty === 'easy' || c.difficulty === 'medium');
    return medList.length >= 8 ? medList : pool;
  }
  return pool;
}

// Generate 4 distinct options including the target
export function generateFourOptions(target: Country, pool: Country[]): { options: Country[]; correctIndex: number } {
  const otherCountries = pool.filter(c => c.code !== target.code);
  const shuffledOthers = shuffleArray(otherCountries);
  const distractors = shuffledOthers.slice(0, 3);
  const options = shuffleArray([target, ...distractors]);
  const correctIndex = options.findIndex(c => c.code === target.code);
  return { options, correctIndex };
}

// Generate Flag Quiz Questions
export function generateFlagQuestions(difficulty: Difficulty, count: number = 10): QuizQuestion[] {
  const pool = getFilteredCountries(difficulty);
  const targets = shuffleArray(pool).slice(0, count);

  return targets.map((target, idx) => {
    const { options, correctIndex } = generateFourOptions(target, pool);
    return {
      id: `flag_${target.code}_${idx}`,
      type: 'flag',
      targetCountry: target,
      prompt_tr: 'Bu bayrak hangi ülkeye aittir?',
      prompt_en: 'Which country does this flag belong to?',
      options,
      correctOptionIndex: correctIndex
    };
  });
}

// Generate Capital Quiz Questions
export function generateCapitalQuestions(
  difficulty: Difficulty, 
  subMode: CapitalQuizSubMode, 
  count: number = 10
): QuizQuestion[] {
  const pool = getFilteredCountries(difficulty);
  const targets = shuffleArray(pool).slice(0, count);

  return targets.map((target, idx) => {
    const { options, correctIndex } = generateFourOptions(target, pool);
    const isReverse = subMode === 'capital_to_country';

    return {
      id: `capital_${target.code}_${idx}`,
      type: isReverse ? 'capital_reverse' : 'capital',
      targetCountry: target,
      prompt_tr: isReverse
        ? `"${target.capital_tr}" hangi ülkenin başkentidir?`
        : `"${target.name_tr}" ülkesinin başkenti hangisidir?`,
      prompt_en: isReverse
        ? `"${target.capital_en}" is the capital of which country?`
        : `What is the capital of "${target.name_en}"?`,
      options,
      correctOptionIndex: correctIndex
    };
  });
}

// Generate Map Quiz Targets
export function generateMapQuestions(difficulty: Difficulty, count: number = 10): QuizQuestion[] {
  const pool = getFilteredCountries(difficulty, true);
  const targets = shuffleArray(pool).slice(0, count);

  return targets.map((target, idx) => {
    return {
      id: `map_${target.code}_${idx}`,
      type: 'map',
      targetCountry: target,
      prompt_tr: `Haritada bul: ${target.name_tr.toUpperCase()}`,
      prompt_en: `Locate on map: ${target.name_en.toUpperCase()}`,
      options: [target],
      correctOptionIndex: 0
    };
  });
}

// Generate Mixed Quiz Questions (12 questions mixing all types)
export function generateMixedQuestions(difficulty: Difficulty, count: number = 12): QuizQuestion[] {
  const mapPool = getFilteredCountries(difficulty, true);
  const generalPool = getFilteredCountries(difficulty);

  const questions: QuizQuestion[] = [];
  const types: ('flag' | 'capital' | 'capital_reverse' | 'map' | 'en_match')[] = [
    'flag',
    'capital',
    'capital_reverse',
    'map',
    'en_match'
  ];

  const shuffledTargets = shuffleArray(generalPool);
  const shuffledMapTargets = shuffleArray(mapPool);

  let genIndex = 0;
  let mapIndex = 0;

  for (let i = 0; i < count; i++) {
    const qType = types[i % types.length];

    if (qType === 'map') {
      const target = shuffledMapTargets[mapIndex % shuffledMapTargets.length];
      mapIndex++;
      questions.push({
        id: `mixed_map_${target.code}_${i}`,
        type: 'map',
        targetCountry: target,
        prompt_tr: `Haritada bul: ${target.name_tr.toUpperCase()}`,
        prompt_en: `Locate on map: ${target.name_en.toUpperCase()}`,
        options: [target],
        correctOptionIndex: 0
      });
    } else if (qType === 'flag') {
      const target = shuffledTargets[genIndex % shuffledTargets.length];
      genIndex++;
      const { options, correctIndex } = generateFourOptions(target, generalPool);
      questions.push({
        id: `mixed_flag_${target.code}_${i}`,
        type: 'flag',
        targetCountry: target,
        prompt_tr: 'Bu bayrak hangi ülkeye aittir?',
        prompt_en: 'Which country belongs to this flag?',
        options,
        correctOptionIndex: correctIndex
      });
    } else if (qType === 'capital') {
      const target = shuffledTargets[genIndex % shuffledTargets.length];
      genIndex++;
      const { options, correctIndex } = generateFourOptions(target, generalPool);
      questions.push({
        id: `mixed_cap_${target.code}_${i}`,
        type: 'capital',
        targetCountry: target,
        prompt_tr: `"${target.name_tr}" ülkesinin başkenti hangisidir?`,
        prompt_en: `What is the capital of "${target.name_en}"?`,
        options,
        correctOptionIndex: correctIndex
      });
    } else if (qType === 'capital_reverse') {
      const target = shuffledTargets[genIndex % shuffledTargets.length];
      genIndex++;
      const { options, correctIndex } = generateFourOptions(target, generalPool);
      questions.push({
        id: `mixed_caprev_${target.code}_${i}`,
        type: 'capital_reverse',
        targetCountry: target,
        prompt_tr: `"${target.capital_tr}" hangi ülkenin başkentidir?`,
        prompt_en: `"${target.capital_en}" is the capital of which country?`,
        options,
        correctOptionIndex: correctIndex
      });
    } else {
      // English name match
      const target = shuffledTargets[genIndex % shuffledTargets.length];
      genIndex++;
      const { options, correctIndex } = generateFourOptions(target, generalPool);
      questions.push({
        id: `mixed_en_${target.code}_${i}`,
        type: 'en_match',
        targetCountry: target,
        prompt_tr: `"${target.name_tr}" ülkesinin İngilizce karşılığı hangisidir?`,
        prompt_en: `What is the English name for "${target.name_tr}"?`,
        options,
        correctOptionIndex: correctIndex
      });
    }
  }

  return shuffleArray(questions);
}
