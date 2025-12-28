# @react-spa-scaffold/prettier-config

Shared Prettier configuration for react-spa-scaffold projects.

## Installation

```bash
npm install -D @react-spa-scaffold/prettier-config prettier
```

For Tailwind CSS class sorting:

```bash
npm install -D prettier-plugin-tailwindcss
```

## Usage

### In package.json (simplest)

```json
{
  "prettier": "@react-spa-scaffold/prettier-config"
}
```

### In prettier.config.js

```javascript
// Base config (no Tailwind)
export { default } from '@react-spa-scaffold/prettier-config';

// With Tailwind class sorting
export { default } from '@react-spa-scaffold/prettier-config/tailwind';
```

### With Customization

```javascript
import config from '@react-spa-scaffold/prettier-config';

export default {
  ...config,
  printWidth: 80, // Override
};
```

## Available Configs

| Config   | Import                                         | Description              |
| -------- | ---------------------------------------------- | ------------------------ |
| Base     | `@react-spa-scaffold/prettier-config`          | Standard formatting      |
| Tailwind | `@react-spa-scaffold/prettier-config/tailwind` | + Tailwind class sorting |

## Configuration

Both configs include:

- `semi: true` - Semicolons
- `singleQuote: true` - Single quotes
- `trailingComma: 'all'` - Trailing commas everywhere
- `printWidth: 120` - Line width
- `tabWidth: 2` - 2-space indentation
- `useTabs: false` - Spaces, not tabs
