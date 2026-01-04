import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { api, ApiClientError } from '@/lib/api';
import {
  mockFetchError,
  mockFetchNetworkError,
  mockFetchNoContent,
  mockFetchSuccess,
  mockFetchUnknownError,
} from '@/test';

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
      mockFetchSuccess({ id: 1 });

      await api[method]('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: httpMethod }),
      );
    });

    it('sends request body for POST/PUT/PATCH', async () => {
      const body = { name: 'Test' };
      mockFetchSuccess({ id: 1 });

      await api.post('/test', body);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ body: JSON.stringify(body) }),
      );
    });

    it('handles full URL without prepending base URL', async () => {
      mockFetchSuccess({});

      await api.get('https://external.api/data');

      expect(global.fetch).toHaveBeenCalledWith('https://external.api/data', expect.anything());
    });
  });

  describe('error handling', () => {
    it.each([
      { status: 404, message: 'Resource not found', hasJson: true },
      { status: 500, message: 'Internal Server Error', hasJson: false },
    ])('handles $status error response', async ({ status, message, hasJson }) => {
      mockFetchError(status, message, hasJson);

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

    it('handles NETWORK_ERROR', async () => {
      mockFetchNetworkError();

      const error = (await api.get('/error').catch((e) => e)) as ApiClientError;

      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('handles UNKNOWN errors', async () => {
      mockFetchUnknownError('string error');

      const error = (await api.get('/error').catch((e) => e)) as ApiClientError;

      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.code).toBe('UNKNOWN');
    });

    it('returns undefined for 204 No Content', async () => {
      mockFetchNoContent();

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
