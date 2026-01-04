import { SignedIn } from '@clerk/react-router';
import { Trans } from '@lingui/react/macro';
import { Link } from 'react-router';

import { AccountButton, LanguageSwitcher, ThemeToggle } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export function Header() {
  return (
    <header className="border-border border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold">
          <Trans comment="Application name displayed in the header navigation">My App</Trans>
        </h1>
        <div className="flex items-center gap-2">
          <SignedIn>
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.PROFILE}>
                <Trans comment="Profile navigation link in header">Profile</Trans>
              </Link>
            </Button>
          </SignedIn>
          <LanguageSwitcher />
          <ThemeToggle />
          <AccountButton />
        </div>
      </div>
    </header>
  );
}
