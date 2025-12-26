# @webapp-base/prettier-config

Shared Prettier configuration for webapp-base projects.

## Installation

```bash
npm install -D @webapp-base/prettier-config prettier
```

For Tailwind CSS class sorting:

```bash
npm install -D prettier-plugin-tailwindcss
```

## Usage

### In package.json (simplest)

```json
{
  "prettier": "@webapp-base/prettier-config"
}
```

### In prettier.config.js

```javascript
// Base config (no Tailwind)
export { default } from '@webapp-base/prettier-config';

// With Tailwind class sorting
export { default } from '@webapp-base/prettier-config/tailwind';
```

### With Customization

```javascript
import config from '@webapp-base/prettier-config';

export default {
  ...config,
  printWidth: 80, // Override
};
```

## Available Configs

| Config   | Import                                  | Description              |
| -------- | --------------------------------------- | ------------------------ |
| Base     | `@webapp-base/prettier-config`          | Standard formatting      |
| Tailwind | `@webapp-base/prettier-config/tailwind` | + Tailwind class sorting |

## Configuration

Both configs include:

- `semi: true` - Semicolons
- `singleQuote: true` - Single quotes
- `trailingComma: 'all'` - Trailing commas everywhere
- `printWidth: 120` - Line width
- `tabWidth: 2` - 2-space indentation
- `useTabs: false` - Spaces, not tabs
