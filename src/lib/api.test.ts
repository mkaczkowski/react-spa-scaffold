import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api, ApiClientError } from '@/lib/api';

describe('api client', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('HTTP methods', () => {
    it.each([
      { method: 'get', httpMethod: 'GET' },
      { method: 'post', httpMethod: 'POST' },
      { method: 'put', httpMethod: 'PUT' },
      { method: 'patch', httpMethod: 'PATCH' },
      { method: 'delete', httpMethod: 'DELETE' },
    ] as const)('$method makes $httpMethod request', async ({ method, httpMethod }) => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      } as Response);

      await api[method]('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: httpMethod }),
      );
    });

    it('sends request body for POST/PUT/PATCH', async () => {
      const body = { name: 'Test' };
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: 1 }),
      } as Response);

      await api.post('/test', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ body: JSON.stringify(body) }),
      );
    });

    it('handles full URL without prepending base URL', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);

      await api.get('https://external.api/data');

      expect(global.fetch).toHaveBeenCalledWith('https://external.api/data', expect.anything());
    });
  });

  describe('error handling', () => {
    it.each([
      { status: 404, message: 'Resource not found', hasJson: true },
      { status: 500, message: 'Internal Server Error', hasJson: false },
    ])('handles $status error response', async ({ status, message, hasJson }) => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status,
        statusText: message,
        json: hasJson ? () => Promise.resolve({ message }) : () => Promise.reject(new Error('No JSON')),
      } as Response);

      const error = (await api.get('/error').catch((e) => e)) as ApiClientError;

      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.message).toBe(message);
      expect(error.status).toBe(status);
    });

    it('handles timeout with TIMEOUT code', async () => {
      vi.useFakeTimers();
      vi.mocked(global.fetch).mockImplementationOnce(
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
      vi.mocked(global.fetch).mockRejectedValueOnce(rejection);

      const error = (await api.get('/error').catch((e) => e)) as ApiClientError;

      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.code).toBe(code);
    });

    it('returns undefined for 204 No Content', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({ ok: true, status: 204 } as Response);

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
