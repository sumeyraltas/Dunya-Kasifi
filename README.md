# Dünya Kâşifi (World Explorer) 🌍

A modern, interactive, and educational web application designed to help you learn countries, capitals, flags, and world geography through fun quizzes and map explorations.

[Türkçe README için tıklayın (For Turkish Readme)](README_TR.md)

## ✨ Features

*   🗺️ **Interactive World Map**: Explore countries freely, discover their capitals, flags, and details on an interactive map.
*   🏁 **Flag Quiz**: Test your knowledge by matching countries with their flags.
*   🏛️ **Capital Quiz**: Guess the capitals of various countries around the world.
*   📍 **Map Quiz**: Find and click the requested country directly on the world map.
*   🎲 **Mixed Quiz**: A challenge combining questions about flags, capitals, and map locations.
*   📚 **Learn Mode**: Study countries continent by continent without the pressure of a timer or score.
*   📊 **Detailed Statistics**: Track your progress, view your total score, correct/incorrect answer ratios, and see your daily streaks.
*   🏆 **Badges & Achievements**: Earn badges as you reach milestones (e.g., scoring points, maintaining daily streaks).
*   🌓 **Dark/Light Mode Support**: Enjoy learning with a UI theme that suits your preference.
*   🔊 **Sound Effects & Text-to-Speech**: Enhance your learning experience with interactive sounds and optional voice reading for country names.
*   🌐 **Bilingual**: Fully supports English and Turkish languages.

## 🛠️ Technologies Used

*   **Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Maps & Geography**: 
    *   `d3-geo` (for map projections)
    *   `topojson-client` (for rendering map data)
    *   `world-atlas` (country topology data)
*   **Animations**: `motion` (Framer Motion)
*   **Package Manager**: [Bun](https://bun.sh/) (or npm/yarn/pnpm)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/) installed on your system.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repo link>
    cd dunya-kasifi
    ```

2.  Install dependencies (using Bun in this example):
    ```bash
    bun install
    # or npm install / yarn install
    ```

3.  Start the development server:
    ```bash
    bun run dev
    # or npm run dev / yarn dev
    ```

4.  Open your browser and navigate to `http://localhost:3000` (or the port provided in your terminal).

## 🎮 How to Play

1.  **Select a Game Mode**: From the home screen, choose between Flags, Capitals, Maps, or the Mixed quiz.
2.  **Choose Difficulty**: Select Easy, Medium, or Hard depending on your confidence level.
3.  **Answer Questions**: Read the prompt and select the correct option or click on the correct location on the map.
4.  **Track Lives & Score**: You have 3 lives per game. Answer correctly to earn points and multipliers!
5.  **Review Stats**: Go to the Statistics tab to see your overall performance and collected badges.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/your-username/dunya-kasifi/issues).
