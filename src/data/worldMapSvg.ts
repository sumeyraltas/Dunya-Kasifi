// Natural Earth World Map SVG cartographic geometry
// Precision-projected on a 1000x500 canvas using Natural Earth I projection
import mapDataRaw from './worldMapData.json';

export interface SvgCountryData {
  id: string; // ISO 3166-1 alpha-2 or internal code
  code: string;
  numericId?: string;
  name_tr: string;
  name_en: string;
  flag_emoji?: string;
  inGame?: boolean;
  d: string;  // Real cartographic SVG path data
  cx: number; // Centroid X for zoom centering & pinpoint
  cy: number; // Centroid Y
}

export const OCEAN_SPHERE_PATH: string = mapDataRaw.spherePath;
export const GRATICULE_PATH: string = mapDataRaw.graticulePath;

export const WORLD_MAP_LIST: SvgCountryData[] = mapDataRaw.countries as SvgCountryData[];

export const WORLD_MAP_PATHS: Record<string, SvgCountryData> = {};
for (const country of WORLD_MAP_LIST) {
  WORLD_MAP_PATHS[country.code] = country;
}
