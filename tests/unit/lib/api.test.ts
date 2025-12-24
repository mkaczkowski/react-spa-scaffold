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

  describe('api.get', () => {
    it('makes GET request and returns data', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const result = await api.get('/test');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' }),
      );
      expect(result).toEqual(mockData);
    });

    it('handles full URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      });

      await api.get('https://external.api/data');

      expect(mockFetch).toHaveBeenCalledWith('https://external.api/data', expect.anything());
    });
  });

  describe('api.post', () => {
    it('makes POST request with body', async () => {
      const mockData = { id: 1 };
      const body = { name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockData),
      });

      const result = await api.post('/test', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('api.put', () => {
    it('makes PUT request with body', async () => {
      const body = { name: 'Updated' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await api.put('/test/1', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe('api.patch', () => {
    it('makes PATCH request with partial body', async () => {
      const body = { name: 'Patched' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      });

      await api.patch('/test/1', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe('api.delete', () => {
    it('makes DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      await api.delete('/test/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test/1'),
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('error handling', () => {
    it('throws ApiClientError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Resource not found' }),
      });

      const error = await api.get('/not-found').catch((e) => e);
      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.message).toBe('Resource not found');
      expect(error.status).toBe(404);
    });

    it('handles error response without JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('No JSON')),
      });

      const error = await api.get('/error').catch((e) => e);
      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.message).toBe('Internal Server Error');
    });

    it('handles timeout', async () => {
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

      await expect(promise).rejects.toThrow(ApiClientError);
      const error = await promise.catch((e) => e);
      expect(error.code).toBe('TIMEOUT');
      expect(error.status).toBe(408);

      vi.useRealTimers();
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const error = await api.get('/network-error').catch((e) => e);
      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('handles unknown error type', async () => {
      mockFetch.mockRejectedValueOnce('string error');

      const error = await api.get('/unknown-error').catch((e) => e);
      expect(error).toBeInstanceOf(ApiClientError);
      expect(error.code).toBe('UNKNOWN');
    });

    it('handles 204 No Content response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await api.delete('/test/1');
      expect(result).toBeUndefined();
    });
  });

  describe('ApiClientError', () => {
    it('has correct properties', () => {
      const error = new ApiClientError('Test error', 400, 'TEST_CODE');

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('ApiClientError');
    });
  });
});
