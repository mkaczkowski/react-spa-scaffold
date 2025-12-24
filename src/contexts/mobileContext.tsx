import { createContext, type ReactNode, useContext } from 'react';

import { BREAKPOINTS, useMediaQuery } from '@/hooks/useMediaQuery';

interface MobileContextValue {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const MobileContext = createContext<MobileContextValue | null>(null);

export function MobileProvider({ children }: { children: ReactNode }) {
  const isAboveMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isAboveLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);

  const isMobile = !isAboveMd;
  const isTablet = isAboveMd && !isAboveLg;
  const isDesktop = isAboveLg;

  return <MobileContext.Provider value={{ isMobile, isTablet, isDesktop }}>{children}</MobileContext.Provider>;
}

export function useMobileContext(): MobileContextValue {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobileContext must be used within MobileProvider');
  }
  return context;
}
