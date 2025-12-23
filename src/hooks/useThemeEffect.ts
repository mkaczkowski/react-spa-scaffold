import { useEffect } from 'react';

import { usePreferencesStore } from '@/stores';

export function useThemeEffect() {
  const theme = usePreferencesStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
}
