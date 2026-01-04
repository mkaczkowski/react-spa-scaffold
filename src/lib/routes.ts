/**
 * Typed route constants.
 * Use these instead of hardcoded strings for type-safe navigation.
 */

export const ROUTES = {
  HOME: '/',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
