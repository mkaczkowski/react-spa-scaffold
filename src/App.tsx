import { Route, Routes } from 'react-router';

import { Header } from '@/components/layout';
import { useThemeEffect } from '@/hooks';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Welcome to My App</h1>
      <p className="text-muted-foreground mt-2">
        Get started by editing <code className="bg-muted rounded px-1">src/App.tsx</code>
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
