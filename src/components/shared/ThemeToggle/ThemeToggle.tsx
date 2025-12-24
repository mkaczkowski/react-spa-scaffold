import { useLingui } from '@lingui/react/macro';
import { Monitor, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTouchSizes } from '@/hooks';
import { usePreferencesStore } from '@/stores';

export function ThemeToggle() {
  const { t } = useLingui();
  const theme = usePreferencesStore((state) => state.theme);
  const toggleTheme = usePreferencesStore((state) => state.toggleTheme);
  const getResolvedTheme = usePreferencesStore((state) => state.getResolvedTheme);
  const sizes = useTouchSizes();

  // Get the resolved theme for icon display
  const resolvedTheme = getResolvedTheme();

  // Determine the aria-label based on current theme
  const getAriaLabel = () => {
    if (theme === 'system') {
      return resolvedTheme === 'dark' ? t`Switch to light mode` : t`Switch to dark mode`;
    }
    return theme === 'light' ? t`Switch to dark mode` : t`Switch to light mode`;
  };

  // Show the icon for the current resolved theme
  const ThemeIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Sun : Moon;

  return (
    <Button variant="ghost" size={sizes.iconButtonLg} onClick={toggleTheme} aria-label={getAriaLabel()}>
      <ThemeIcon className="size-5" />
    </Button>
  );
}
