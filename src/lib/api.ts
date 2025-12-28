/**
 * API client abstraction.
 * Provides a centralized, typed API layer with error handling.
 */

import type { ApiError } from '@/types/api';

/**
 * API configuration.
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
} as const;

/**
 * Custom API error class
 */
export class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Request options extending standard fetch options
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
}

/**
 * Create an AbortController with timeout
 */
function createTimeoutController(timeout: number): { controller: AbortController; timeoutId: NodeJS.Timeout } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
}

/**
 * Parse API error response
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return {
      message: data.message || data.error || response.statusText,
      code: data.code,
      status: response.status,
    };
  } catch {
    return {
      message: response.statusText || 'An error occurred',
      status: response.status,
    };
  }
}

/**
 * Core request function
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeout = API_CONFIG.timeout, ...fetchOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseUrl}${endpoint}`;

  const { controller, timeoutId } = createTimeoutController(timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await parseErrorResponse(response);
      throw new ApiClientError(error.message, response.status, error.code);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408, 'TIMEOUT');
      }
      throw new ApiClientError(error.message, 0, 'NETWORK_ERROR');
    }

    throw new ApiClientError('An unexpected error occurred', 0, 'UNKNOWN');
  }
}

/**
 * API client with HTTP method helpers
 */
export const api = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
