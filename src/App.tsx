import { Trans } from '@lingui/react/macro';
import { Route, Routes } from 'react-router';

import { Header } from '@/components/layout';
import { useThemeEffect } from '@/hooks';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">
        <Trans>Welcome to My App</Trans>
      </h1>
      <p className="text-muted-foreground mt-2">
        <Trans>
          Get started by editing <code className="bg-muted rounded px-1">src/App.tsx</code>
        </Trans>
      </p>
    </div>
  );
}

export default function App() {
  useThemeEffect();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}
