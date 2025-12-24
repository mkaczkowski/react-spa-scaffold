import { Trans } from '@lingui/react/macro';

import { LanguageSwitcher, ThemeToggle } from '@/components/shared';

export function Header() {
  return (
    <header className="border-border border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold">
          <Trans comment="Application name displayed in the header navigation">My App</Trans>
        </h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
