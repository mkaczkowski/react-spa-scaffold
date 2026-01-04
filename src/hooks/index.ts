// Media query and responsive hooks
export { useMediaQuery, BREAKPOINTS } from './useMediaQuery';
export { useMobileContext } from '@/contexts/mobileContext';
export { useTouchSizes } from './useTouchSizes';
export { useIOSViewportReset } from './useIOSViewportReset';

// Theme and UI hooks
export { useThemeEffect } from './useThemeEffect';
export { useDocumentTitle } from './useDocumentTitle';

// State and storage hooks
export { useLocalStorage } from './useLocalStorage';
export { useSyncedState } from './useSyncedState';
export { useSyncedFormData } from './useSyncedFormData';

// Utility hooks
export { useCopyFeedback } from './useCopyFeedback';
export { useDebouncedCallback } from './useDebouncedCallback';
export { useKeyboardShortcut } from './useKeyboardShortcuts';

// i18n hooks
export { useLanguage } from './useLanguage';

// API hooks
export { useExampleQuery } from './useExampleQuery';

// Form hooks
export { useRegisterForm } from './useRegisterForm';

// Supabase hooks
export {
  // Generic query hook
  useSupabaseQuery,
  // Profile hooks (type-safe mutations)
  useCurrentProfile,
  useProfile,
  useUpsertProfile,
  useUpdateProfile,
  useDeleteProfile,
  // Types
  type UseSupabaseQueryOptions,
} from './supabase';

// Supabase context
export { useSupabase } from '@/contexts/supabaseContext';
