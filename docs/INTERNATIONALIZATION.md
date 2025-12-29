# Internationalization (i18n)

This project uses [Lingui](https://lingui.dev/) for internationalization. **ESLint will warn about untranslated strings.**

## Quick Reference

```tsx
// Trans component - for JSX content
<Trans comment="Error shown when upload exceeds 10MB">File too large</Trans>;

// t() function - for strings (aria-labels, placeholders, etc.)
const { t } = useLingui();
<Button aria-label={t({ message: 'Close', comment: 'Close dialog button' })} />;

// msg() - for messages defined outside components
const labels = {
  save: msg({ message: 'Save', comment: 'Form submit button' }),
};
```

## Adding Translations

1. Wrap text with `<Trans>` or `t()` and add a `comment`
2. Run `pnpm i18n:extract` to update PO files
3. Translate in `src/locales/{locale}.po`
4. Build compiles translations automatically

## Writing Comments

Comments help translators understand context. They appear in PO files as `#.` lines.

```tsx
// Good - explains where and why
<Trans comment="Error message when file upload exceeds 10MB limit">
  File too large
</Trans>

// Good - explains the variable
<Trans comment="Badge showing unread count, {count} is 1-99 or 99+">
  {count} new
</Trans>

// Bad - obvious or vague
<Trans comment="A message">Error</Trans>
<Trans comment="Title">Welcome</Trans>
```

**Tip:** Use `context` prop when the same word needs different translations:

```tsx
<Trans context="calendar">Date</Trans>
<Trans context="romantic">Date</Trans>
```

## ESLint Rules

The `eslint-plugin-lingui` enforces translations:

- `no-unlocalized-strings` - Warns about untranslated JSX text
- `t-call-in-function` - Ensures `t()` is called inside functions
- `no-trans-inside-trans` - Prevents nested Trans components

Excluded from checks: tests, mocks, UI primitives, config files.

### Auto-Ignored Technical Identifiers

The ESLint config automatically ignores strings that are technical identifiers:

**Prop names** (values don't need translation):

- HTML: `id`, `htmlFor`, `autoComplete`, `aria-invalid`
- Styling: `className`, `styleName`
- Components: `type`, `variant`, `size`, `role`, `name`
- Routing: `href`, `to`, `path`
- Data: `queryKey`, `data-testid`

**Function arguments**:

- `register('fieldName')` - React Hook Form field names
- `console.*`, `Error()` - Debug/error messages

```tsx
// These are fine - no translation needed
<Label htmlFor="email">
<Input id="email" autoComplete="email" {...register('email')} />

// This DOES need translation (user-facing placeholder)
placeholder={t({ message: 'Enter email', comment: 'Email input hint' })}
```

## Adding a New Locale

Edit `lingui.config.js` and add the locale code to the `locales` array.
