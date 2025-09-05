## Overview

Minimal overview of the react client application, to run the application read the root directory README.md

### Eslint Config Setup

Ignores the dist directory.

- ESLint prevents from checking build output files, as they are outputted they can be changed over time.

### Extends in EsLint Config

`extends` keyword is extending rules on what is the minimal configuration.

- JavaScript recommended rules (js.configs.recommended)
  - Provides basic JavaScript linting rules such as catching syntax errors, unused variables, etc.
  - Will stop only at build time
- React Hooks rules (reactHooks.configs['recommended-latest'])
  - Enforces React Hooks best practices
  - Hooks are called in the same order and only at top level of components.
- React Refresh rules (reactRefresh.configs.vite)
  - Ensures components are compatible with Vite's hot module replacement (HMR) for fast development feedback

### Language Configuration

Language Configuration:

- ECMAScript 2020+ support with latest features enabled
- Browser globals available (like window, document, etc.)
- JSX parsing enabled for React components
- ES modules support for import/export statements
  - i.e. `import express from "express";`
