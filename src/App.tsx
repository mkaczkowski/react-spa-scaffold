import { useLingui } from '@lingui/react/macro';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

import { Header } from '@/components/layout';
import { SEO } from '@/components/shared';
import { PageLoading } from '@/components/ui/loading';
import { SkipLink } from '@/components/ui/visually-hidden';
import { useThemeEffect } from '@/hooks';
import { ROUTES } from '@/lib/routes';

// Lazy load pages for code splitting
// eslint-disable-next-line lingui/no-unlocalized-strings
const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })));
// eslint-disable-next-line lingui/no-unlocalized-strings
const NotFoundPage = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage })));

export default function App() {
  const { t } = useLingui();
  useThemeEffect();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <SEO
        description={t({
          message: 'A modern React 19 application with TypeScript and Vite',
          comment: 'Default site-wide meta description for SEO',
        })}
      />
      <SkipLink />
      <Header />
      <main id="main">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
