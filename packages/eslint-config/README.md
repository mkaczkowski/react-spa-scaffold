# @react-spa-scaffold/eslint-config

Shared ESLint configuration for react-spa-scaffold projects.

## Installation

```bash
npm install -D @react-spa-scaffold/eslint-config eslint typescript-eslint @eslint/js eslint-config-prettier
```

For React projects, also install:

```bash
npm install -D eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-lingui
```

## Usage

### React Projects (default)

```javascript
// eslint.config.js
import config from '@react-spa-scaffold/eslint-config';

export default config;
```

### Node.js Projects

```javascript
// eslint.config.js
import config from '@react-spa-scaffold/eslint-config/node';

export default config;
```

### With Customization

```javascript
// eslint.config.js
import config from '@react-spa-scaffold/eslint-config';

export default [
  ...config,
  {
    rules: {
      // Your overrides
      'no-console': 'off',
    },
  },
];
```

## Available Configs

| Config          | Import                                   | Description                          |
| --------------- | ---------------------------------------- | ------------------------------------ |
| React (default) | `@react-spa-scaffold/eslint-config`      | React + TypeScript + LinguiJS        |
| Node.js         | `@react-spa-scaffold/eslint-config/node` | Node.js servers (no React/i18n)      |
| Base            | `@react-spa-scaffold/eslint-config/base` | TypeScript only (for custom configs) |

## What's Included

### React Config

- TypeScript strict rules
- React Hooks rules
- React Refresh (HMR support)
- LinguiJS i18n enforcement
- Prettier compatibility

### Node.js Config

- TypeScript strict rules
- Console logging allowed
- No React/i18n rules
- Prettier compatibility
