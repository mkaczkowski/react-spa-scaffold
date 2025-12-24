# Internationalization (i18n) Guide

This project uses [Lingui](https://lingui.dev/) for internationalization. This guide covers best practices for adding and maintaining translations.

## Adding Translator Comments

**Always add a `comment` to help translators understand the context.** Comments are extracted to PO files and help translators make accurate translations.

### Trans Component (JSX Content)

```tsx
import { Trans } from '@lingui/react/macro';

// Always include a comment describing the context
<Trans comment="Button label for submitting the login form">Sign In</Trans>

// For acronyms or technical terms
<Trans comment="Acronym for Key Performance Indicator">View KPIs</Trans>

// For content with variables
<Trans comment="Welcome message shown after login, {name} is the user's first name">
  Hello, {name}!
</Trans>
```

### t() Function (String Translations)

Use the object syntax to add comments:

```tsx
import { useLingui } from '@lingui/react/macro';

function MyComponent() {
  const { t } = useLingui();

  // With comment
  const label = t({
    message: 'Settings',
    comment: 'Navigation link to user settings page',
  });

  // For accessibility labels
  <Button
    aria-label={t({
      message: 'Close dialog',
      comment: 'Accessibility label for the close button on modal dialogs',
    })}
  />;
}
```

### msg() / defineMessage() (Lazy Translations)

For messages defined outside components:

```tsx
import { msg } from '@lingui/core/macro';

const statusMessages = {
  open: msg({
    message: 'Open',
    comment: 'Status indicating a ticket or task is open and active',
  }),
  closed: msg({
    message: 'Closed',
    comment: 'Status indicating a ticket or task has been resolved',
  }),
};

// Use with useLingui hook
function StatusBadge({ status }) {
  const { _ } = useLingui();
  return <span>{_(statusMessages[status])}</span>;
}
```

## Using Context for Disambiguation

When the same text has different meanings, use `context`:

```tsx
// Same word, different meanings
<Trans context="romantic meeting with someone">Date</Trans>
<Trans context="calendar date">Date</Trans>

// Both translate to different strings in other languages
```

## Writing Good Comments

### Do

- Explain where the text appears in the UI
- Clarify any ambiguous terms or abbreviations
- Note if there are character length constraints
- Describe any variables or placeholders

### Don't

- State the obvious ("This is a button")
- Leave comments empty
- Use technical jargon translators won't understand

### Examples

```tsx
// Good
<Trans comment="Error message when file upload exceeds 10MB limit">
  File too large
</Trans>

// Good - explains variable
<Trans comment="Notification count badge, {count} is number of unread items (1-99+)">
  {count} new
</Trans>

// Bad - too vague
<Trans comment="A message">Error</Trans>

// Bad - obvious
<Trans comment="This is the title">Welcome</Trans>
```

## Workflow

### 1. Add Translations in Code

Add `<Trans>` or `t()` with descriptive comments.

### 2. Extract Messages

```bash
pnpm i18n:extract
```

This updates PO files in `src/locales/` with new messages and comments.

### 3. Translate

PO files can be:

- Edited directly in a text editor
- Imported into translation management systems (Crowdin, Phrase, etc.)
- Sent to translators who use PO editing tools

### 4. Compile

Translations are automatically compiled during build via the Vite plugin.

## PO File Format

After extraction, comments appear in PO files as:

```po
#. Button label for submitting the login form
#: src/pages/Login.tsx:42
msgid "Sign In"
msgstr "Iniciar sesión"
```

The `#.` prefix indicates an extracted comment from source code.

## Supported Locales

| Code | Language |
| ---- | -------- |
| en   | English  |
| es   | Spanish  |
| de   | German   |

To add a new locale, update `lingui.config.js`.
