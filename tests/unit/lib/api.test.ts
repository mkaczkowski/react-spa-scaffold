import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api, ApiClientError } from '@/lib/api';

describe('api client', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = mockFetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('HTTP methods', () => {
    it.each([
      { method: 'get', httpMethod: 'GET' },
      { method: 'post', httpMethod: 'POST' },
      { method: 'put', httpMethod: 'PUT' },
      { method: 'patch', httpMethod: 'PATCH' },
      { method: 'delete', httpMethod: 'DELETE' },
    ] as const)('$method makes $httpMethod request', async ({ method, httpMethod }) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      });

      await api[method]('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: httpMethod }),
      );
    });

    it('sends request body for POST/PUT/PATCH', async () => {
      const body = { name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      });

      await api.post('/test', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ body: JSON.stringify(body) }),
      );
    });

    it('handles full URL without prepending base URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await api.get('https://external.api/data');

      expect(mockFetch).toHaveBeenCalledWith('https://external.api/data', expect.anything());
    });
  });

  describe('error handling', () => {
    it.each([
      { status: 404, message: 'Resource not found', hasJson: true },
      { status: 500, message: 'Internal Server Error', hasJson: false },
    ])('handles $status error response', async ({ status, message, hasJson }) => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status,
        statusText: message,
        json: hasJson ? () => Promise.resolve({ message }) : () => Promise.reject(new Error('No JSON')),
      });

      const error = (await api.get('/error').catch((e) => e)) as ApiClientError;

      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.message).toBe(message);
      expect(error.status).toBe(status);
    });

    it('handles timeout with TIMEOUT code', async () => {
      vi.useFakeTimers();
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            const error = new Error('Aborted');
            error.name = 'AbortError';
            setTimeout(() => reject(error), 100);
          }),
      );

      const promise = api.get('/slow', { timeout: 50 });
      vi.advanceTimersByTime(100);

      const error = (await promise.catch((e) => e)) as ApiClientError;
      expect(error.code).toBe('TIMEOUT');
      expect(error.status).toBe(408);

      vi.useRealTimers();
    });

    it.each([
      { rejection: new Error('Network failure'), code: 'NETWORK_ERROR' },
      { rejection: 'string error', code: 'UNKNOWN' },
    ])('handles $code errors', async ({ rejection, code }) => {
      mockFetch.mockRejectedValueOnce(rejection);

      const error = (await api.get('/error').catch((e) => e)) as ApiClientError;

      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.code).toBe(code);
    });

    it('returns undefined for 204 No Content', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 204 });

      const result = await api.delete('/test/1');

      expect(result).toBeUndefined();
    });
  });

  describe('ApiClientError', () => {
    it('has correct properties', () => {
      const error = new ApiClientError('Test error', 400, 'TEST_CODE');

      expect(error).toMatchObject({
        message: 'Test error',
        status: 400,
        code: 'TEST_CODE',
        name: 'ApiClientError',
      });
    });
  });
});
