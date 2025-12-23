import { ThemeToggle } from '@/components/shared';

export function Header() {
  return (
    <header className="border-border border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold">My App</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
