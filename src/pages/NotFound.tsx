import { Trans } from '@lingui/react/macro';
import { Home } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';

export function NotFoundPage() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-foreground text-6xl font-bold">404</h1>
      <h2 className="text-muted-foreground mt-4 text-2xl">
        <Trans comment="Heading shown on 404 error page when URL doesn't exist">Page Not Found</Trans>
      </h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        <Trans comment="Explanation message on 404 error page">
          The page you're looking for doesn't exist or has been moved.
        </Trans>
      </p>
      <Button asChild className="mt-8">
        <Link to={ROUTES.HOME}>
          <Home className="mr-2 size-4" />
          <Trans comment="Button label to navigate back to the home page from 404 error">Back to Home</Trans>
        </Link>
      </Button>
    </div>
  );
}
