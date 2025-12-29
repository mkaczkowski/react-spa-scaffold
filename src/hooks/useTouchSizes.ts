import { useMobileContext } from '@/contexts/mobileContext';

export function useTouchSizes() {
  const { isMobile } = useMobileContext();

  return {
    button: isMobile ? 'touch' : 'default',
    buttonSm: isMobile ? 'touch' : 'sm',
    iconButton: isMobile ? 'icon-touch' : 'icon-sm',
    iconButtonLg: isMobile ? 'icon-touch' : 'icon',
    input: isMobile ? 'touch' : 'default',
    select: isMobile ? 'touch' : 'default',
    toggle: isMobile ? 'touch' : 'sm',
    textarea: isMobile ? 'touch' : 'default',
  } as const;
}
