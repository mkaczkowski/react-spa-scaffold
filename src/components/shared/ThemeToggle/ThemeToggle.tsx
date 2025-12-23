import { useLingui } from '@lingui/react/macro';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTouchSizes } from '@/hooks';
import { usePreferencesStore } from '@/stores';

export function ThemeToggle() {
  const { t } = useLingui();
  const theme = usePreferencesStore((state) => state.theme);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  const sizes = useTouchSizes();

  return (
    <Button
      variant="ghost"
      size={sizes.iconButtonLg}
      onClick={toggleTheme}
      aria-label={theme === 'light' ? t`Switch to dark mode` : t`Switch to light mode`}
    >
      {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
    </Button>
  );
}
