# Gemini Project: Ventus Games

This document provides a comprehensive overview of the Ventus Games project, its structure, and how to work with it.

## Project Overview

Ventus Games is a mobile-first party game application built using a modern web stack. The application is designed to be a collection of social games that can be played by a group of people. It is built with the Ionic Framework for the UI components, React for the application logic, and TypeScript for type safety. The project is set up to be built as a native mobile application using Capacitor.

The application currently features two games:
- **Social Ladder**: A game where players discover how their friends perceive them.
- **Psychologist**: A game where one player acts as a "psychologist" and must guess the "symptom" that the other players ("patients") are exhibiting.

The project follows a component-based architecture with a clear separation of concerns. Game data is stored in JSON files, and React hooks are used to load and manage this data.

### Core Technologies

- **Frameworks**: Ionic, React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Native Runtime**: Capacitor
- **Routing**: React Router
- **Testing**: Vitest (unit), Cypress (e2e)
- **Linting**: ESLint

## Building and Running the Project

The project's `package.json` file contains all the necessary scripts to develop, build, and test the application.

### Development

To run the application in a local development environment with hot-reloading, use the following command:

```bash
npm run dev
```

This will start a Vite development server, and you can access the application at `http://localhost:5173` by default.

### Building for Production

To create a production-ready build of the web assets, run:

```bash
npm run build
```

This command first runs the TypeScript compiler (`tsc`) to check for type errors and then uses Vite to bundle the application into the `dist` directory. This `dist` directory is the `webDir` configured for Capacitor.

### Testing

The project is configured with both unit and end-to-end tests.

- **Unit Tests**: To run the unit tests using Vitest, use:

  ```bash
  npm run test.unit
  ```

- **End-to-End Tests**: To run the end-to-end tests using Cypress, use:

  ```bash
  npm run test.e2e
  ```

### Linting

To check the codebase for linting errors and style issues, run:

```bash
npm run lint
```

## Development Conventions

- **Code Style**: The project uses ESLint with plugins for TypeScript and React to enforce a consistent code style. The configuration can be found in `eslint.config.js`.
- **Component Structure**: Components are located in `src/components`. Pages, which are top-level components for routes, are in `src/pages`.
- **State Management**: Global application state, such as the list of players, is managed via React Context in `src/context/GameContext.tsx`.
- **Data**: Game-specific data, like questions, is stored in JSON files under `src/game_data`.
- **Native Integration**: Capacitor is used for native mobile integration. Configuration is in `capacitor.config.ts`. To update the native project after making changes, you can run `npx cap sync`.
