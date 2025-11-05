/**
 * API Client for Xano backend
 * Handles authentication, token management, and HTTP requests
 */

export const API_FALLBACK_HOST = 'https://xjxu-zuqd-jod4.n7e.xano.io';

const sanitizeBaseUrl = (value: string | undefined, defaultPath: string) => {
  if (!value) {
    return `${API_FALLBACK_HOST}${defaultPath}`;
  }
  return value.trim();
};

const API_BASE_URLS = {
  auth: sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL_AUTH, '/api/auth'),
  category: sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL_CATEGORY, '/api/category'),
  comment: sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL_COMMENT, '/api/comment'),
  confession: sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL_CONFESSION, '/api/confession'),
  theme: sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL_THEME, '/api/theme'),
} as const;

const AUTH_TOKEN_KEY = 'connexxion_auth_token';
const USER_DATA_KEY = 'connexxion_user_data';

export type ApiGroup = 'auth' | 'category' | 'comment' | 'confession' | 'theme';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

class ApiClient {
  private authToken: string | null;

  constructor() {
    this.authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Get the base URL for a specific API group
   */
  private getBaseUrl(group: ApiGroup): string {
    return API_BASE_URLS[group];
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Make an authenticated HTTP request
   */
  async request<T>(
    group: ApiGroup,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const baseUrl = this.getBaseUrl(group);
    const url = `${baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP Error: ${response.status}`,
          code: errorData.code,
          status: response.status,
        } as ApiError;
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as ApiError).message) {
        throw error;
      }
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(group: ApiGroup, endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
        ).toString()
      : '';

    return this.request<T>(group, `${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(group: ApiGroup, endpoint: string, data?: any): Promise<T> {
    return this.request<T>(group, endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(group: ApiGroup, endpoint: string, data?: any): Promise<T> {
    return this.request<T>(group, endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(group: ApiGroup, endpoint: string, data?: any): Promise<T> {
    return this.request<T>(group, endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(group: ApiGroup, endpoint: string): Promise<T> {
    return this.request<T>(group, endpoint, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
