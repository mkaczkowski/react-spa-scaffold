import { Trans, useLingui } from '@lingui/react/macro';

import { RegisterForm, SEO } from '@/components/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function HomePage() {
  const { t } = useLingui();

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <SEO
        title={t({ message: 'Home', comment: 'Home page title for SEO' })}
        description={t({
          message: 'Welcome to our modern React application',
          comment: 'Home page meta description for SEO',
        })}
      />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          <Trans comment="Main heading on the home page">Welcome to My App</Trans>
        </h1>
        <p className="text-muted-foreground mt-2">
          <Trans comment="Instructions for developers on how to start customizing the app">
            Get started by editing <code className="bg-muted rounded px-1">src/App.tsx</code>
          </Trans>
        </p>
      </div>

      {/* Form validation demo */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans comment="Register form card title">Registration Form</Trans>
          </CardTitle>
          <CardDescription>
            <Trans comment="Register form card description">React Hook Form + Zod validation demo</Trans>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
