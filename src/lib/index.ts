/**
 * Central lib exports.
 * Import from '@/lib' instead of individual files.
 */

export { cn } from './utils';
export { STORAGE_KEYS, isAppKey } from './storageKeys';
export { APP_CONFIG, API_CONFIG, SENTRY_CONFIG, CLERK_CONFIG, SUPABASE_CONFIG, PERFORMANCE_CONFIG } from './config';
export { ROUTES, type AppRoute } from './routes';
export { env, validateEnv, type Env } from './env';
export { api, ApiClientError } from './api';
export { getStorageItem, setStorageItem, removeStorageItem, clearAppStorage } from './storage';
export { registerFormSchema, type RegisterFormData } from './validations';
export { createSelectors } from './createSelectors';

// Supabase
export { createSupabaseClient, type TypedSupabaseClient, type GetTokenFn } from './supabase';
