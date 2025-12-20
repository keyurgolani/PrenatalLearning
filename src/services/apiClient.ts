/**
 * API Client Service
 * Centralized HTTP client with authentication handling
 * Requirements: 3.3 - Store JWT token securely in HTTP-only cookie
 * Requirements: 16.1 - Validate JWT tokens on all protected API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: { field: string; message: string }[];
  public readonly isAuthError: boolean;

  constructor(
    message: string,
    statusCode: number,
    details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isAuthError = statusCode === 401;
  }
}

/**
 * Request interceptor type
 */
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

/**
 * Response interceptor type
 */
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

/**
 * Error interceptor type
 */
type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

/**
 * Interceptors storage
 */
const interceptors = {
  request: [] as RequestInterceptor[],
  response: [] as ResponseInterceptor[],
  error: [] as ErrorInterceptor[],
};

/**
 * Auth error handler - called when 401 is received
 */
let onAuthError: (() => void) | null = null;

/**
 * Set the auth error handler for 401 responses
 * This should be called by AuthContext to set up redirect to login
 */
export function setAuthErrorHandler(handler: () => void): void {
  onAuthError = handler;
}

/**
 * Clear the auth error handler
 */
export function clearAuthErrorHandler(): void {
  onAuthError = null;
}

/**
 * Add a request interceptor
 * @returns Function to remove the interceptor
 */
export function addRequestInterceptor(interceptor: RequestInterceptor): () => void {
  interceptors.request.push(interceptor);
  return () => {
    const index = interceptors.request.indexOf(interceptor);
    if (index > -1) {
      interceptors.request.splice(index, 1);
    }
  };
}

/**
 * Add a response interceptor
 * @returns Function to remove the interceptor
 */
export function addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
  interceptors.response.push(interceptor);
  return () => {
    const index = interceptors.response.indexOf(interceptor);
    if (index > -1) {
      interceptors.response.splice(index, 1);
    }
  };
}

/**
 * Add an error interceptor
 * @returns Function to remove the interceptor
 */
export function addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
  interceptors.error.push(interceptor);
  return () => {
    const index = interceptors.error.indexOf(interceptor);
    if (index > -1) {
      interceptors.error.splice(index, 1);
    }
  };
}

/**
 * Apply request interceptors
 */
async function applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
  let result = config;
  for (const interceptor of interceptors.request) {
    result = await interceptor(result);
  }
  return result;
}

/**
 * Apply response interceptors
 */
async function applyResponseInterceptors(response: Response): Promise<Response> {
  let result = response;
  for (const interceptor of interceptors.response) {
    result = await interceptor(result);
  }
  return result;
}

/**
 * Apply error interceptors
 */
async function applyErrorInterceptors(error: ApiError): Promise<ApiError> {
  let result = error;
  for (const interceptor of interceptors.error) {
    result = await interceptor(result);
  }
  return result;
}

/**
 * Request configuration options
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuthErrorHandler?: boolean;
}

/**
 * Make an API request with interceptors and auth handling
 * Requirements: 3.3 - Include credentials for HTTP-only cookies
 * Requirements: 16.1 - Handle 401 responses
 */
export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, skipAuthErrorHandler = false, ...restOptions } = options;

  // Build the full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Default config with credentials for cookies
  let config: RequestInit = {
    ...restOptions,
    credentials: 'include', // Include cookies for HTTP-only JWT token
    headers: {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    },
  };

  // Add body if present
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  // Apply request interceptors
  config = await applyRequestInterceptors(config);

  try {
    let response = await fetch(url, config);

    // Apply response interceptors
    response = await applyResponseInterceptors(response);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401 && !skipAuthErrorHandler) {
      if (onAuthError) {
        onAuthError();
      }
      const error = new ApiError('Unauthorized', 401);
      throw await applyErrorInterceptors(error);
    }

    // Parse response
    const data = await response.json().catch(() => ({}));

    // Handle error responses
    if (!response.ok) {
      const error = new ApiError(
        data.error || `Request failed with status ${response.status}`,
        response.status,
        data.details
      );
      throw await applyErrorInterceptors(error);
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    const apiError = new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
    throw await applyErrorInterceptors(apiError);
  }
}

/**
 * GET request helper
 */
export function get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export function post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT request helper
 */
export function put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * PATCH request helper
 */
export function patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'PATCH', body });
}

/**
 * DELETE request helper
 */
export function del<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Upload file with multipart/form-data
 */
export async function upload<T>(
  endpoint: string,
  formData: FormData,
  options?: Omit<RequestOptions, 'method' | 'body' | 'headers'>
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  let config: RequestInit = {
    ...options,
    method: 'POST',
    credentials: 'include',
    body: formData,
    // Don't set Content-Type - browser will set it with boundary
  };

  // Apply request interceptors (but skip Content-Type header modification)
  config = await applyRequestInterceptors(config);
  // Remove Content-Type to let browser set it for multipart
  if (config.headers && typeof config.headers === 'object') {
    const headers = config.headers as Record<string, string>;
    delete headers['Content-Type'];
  }

  try {
    let response = await fetch(url, config);
    response = await applyResponseInterceptors(response);

    if (response.status === 401 && !options?.skipAuthErrorHandler) {
      if (onAuthError) {
        onAuthError();
      }
      const error = new ApiError('Unauthorized', 401);
      throw await applyErrorInterceptors(error);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new ApiError(
        data.error || `Upload failed with status ${response.status}`,
        response.status,
        data.details
      );
      throw await applyErrorInterceptors(error);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const apiError = new ApiError(
      error instanceof Error ? error.message : 'Upload failed',
      0
    );
    throw await applyErrorInterceptors(apiError);
  }
}

/**
 * API client object with all methods
 */
export const apiClient = {
  request,
  get,
  post,
  put,
  patch,
  del,
  upload,
  setAuthErrorHandler,
  clearAuthErrorHandler,
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
  ApiError,
};

export default apiClient;
