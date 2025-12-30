/**
 * Error handling utilities.
 */

/** Wraps async file read with fallback on error. */
export async function readWithFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

/** Extracts error message from unknown error. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
