import { vi } from 'vitest';

/**
 * Mock a successful fetch response with JSON data.
 *
 * @remarks Requires `vi.spyOn(global, 'fetch')` in beforeEach
 */
export function mockFetchSuccess<T>(data: T, status = 200): void {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response);
}

/**
 * Mock a 204 No Content response.
 *
 * @remarks Requires `vi.spyOn(global, 'fetch')` in beforeEach
 */
export function mockFetchNoContent(): void {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: true,
    status: 204,
  } as Response);
}

/**
 * Mock an error response (4xx/5xx).
 *
 * @remarks Requires `vi.spyOn(global, 'fetch')` in beforeEach
 */
export function mockFetchError(status: number, message: string, hasJson = true): void {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: false,
    status,
    statusText: message,
    json: hasJson ? () => Promise.resolve({ message }) : () => Promise.reject(new Error('No JSON')),
  } as Response);
}

/**
 * Mock a network error (fetch rejection).
 *
 * @remarks Requires `vi.spyOn(global, 'fetch')` in beforeEach
 */
export function mockFetchNetworkError(message = 'Network failure'): void {
  vi.mocked(global.fetch).mockRejectedValueOnce(new Error(message));
}

/**
 * Mock an unknown error (non-Error rejection).
 *
 * @remarks Requires `vi.spyOn(global, 'fetch')` in beforeEach
 */
export function mockFetchUnknownError(rejection: unknown = 'string error'): void {
  vi.mocked(global.fetch).mockRejectedValueOnce(rejection);
}
