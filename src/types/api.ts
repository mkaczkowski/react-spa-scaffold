/**
 * API response types.
 * Shared between hooks, mocks, and components.
 */

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Generic API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
