/**
 * Reusable backend API client service for TrustLens
 */

const getBaseUrl = (): string => {
  // Use VITE_API_URL or fallback to http://localhost:5000
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  return 'http://localhost:5000';
};

export const API_URL = getBaseUrl();

// Utility helpers for managing tokens in local storage
export const getAccessToken = () => localStorage.getItem('veramedia_accessToken') || localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('veramedia_refreshToken') || localStorage.getItem('refreshToken');

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('veramedia_accessToken', accessToken);
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('veramedia_refreshToken', refreshToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('veramedia_accessToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('veramedia_refreshToken');
  localStorage.removeItem('refreshToken');
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('veramedia_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const setStoredUser = (user: any) => {
  localStorage.setItem('veramedia_user', JSON.stringify(user));
};

interface RequestOptions extends RequestInit {
  body?: any;
  skipAuth?: boolean;
}

/**
 * Generic fetch wrapper with automatic auth headers and refresh token mechanism
 */
export async function apiRequest(endpoint: string, options: RequestOptions = {}): Promise<any> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Access Token if available and not skipped
  if (!options.skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  let response = await fetch(url, fetchOptions);

  // If unauthorized, attempt to refresh token once
  if (response.status === 401 && !options.skipAuth) {
    const rToken = getRefreshToken();
    if (rToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccess = refreshData.accessToken || refreshData.token;
          const newRefresh = refreshData.refreshToken || rToken;
          
          if (newAccess) {
            setTokens(newAccess, newRefresh);
            // Retry the original request
            headers.set('Authorization', `Bearer ${newAccess}`);
            response = await fetch(url, fetchOptions);
          }
        } else {
          // If refresh token request itself fails, clear tokens and redirect or logout
          clearTokens();
        }
      } catch (e) {
        console.error('Failed to auto-refresh access token:', e);
      }
    }
  }

  // Parse response
  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = responseData?.message || responseData?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return responseData;
}

/**
 * Authentication service calls matching real backend routes
 */
export const authService = {
  // 1. Register User
  async register(data: { fullName: string; name?: string; email: string; username: string; password?: string }) {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        fullName: data.fullName,
        name: data.fullName, // Send both name and fullName for backend compatibility
        email: data.email,
        username: data.username,
        password: data.password,
      },
      skipAuth: true,
    });
  },

  // 2. Email OTP Verification
  async verifyEmail(data: { email: string; code: string }) {
    return apiRequest('/api/auth/verify-email', {
      method: 'POST',
      body: {
        email: data.email,
        code: data.code,
        otp: data.code, // Send both otp and code for backend compatibility
      },
      skipAuth: true,
    });
  },

  // 3. Login User
  async login(data: { email: string; password?: string }) {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: data.email,
        username: data.email, // Map email to username as well to support identifier logins
        password: data.password,
      },
      skipAuth: true,
    });
  },

  // 4. Forgot Password (Request OTP)
  async forgotPassword(data: { email: string }) {
    return apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: data.email,
      },
      skipAuth: true,
    });
  },

  // 5. Verify Forgot Password OTP
  async verifyForgotPassword(data: { email: string; code: string }) {
    return apiRequest('/api/auth/verify-forgot-password', {
      method: 'POST',
      body: {
        email: data.email,
        code: data.code,
        otp: data.code, // Send both otp and code for backend compatibility
      },
      skipAuth: true,
    });
  },

  // 6. Reset Password
  async resetPassword(data: { email: string; code: string; password?: string }) {
    return apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: {
        email: data.email,
        code: data.code,
        otp: data.code, // Send both otp and code
        password: data.password,
        newPassword: data.password, // Send both password and newPassword
      },
      skipAuth: true,
    });
  },

  // 7. Change Password with auth middleware
  async changePassword(data: { oldPassword?: string; newPassword?: string }) {
    // Attempt with POST, if it fails or if PATCH is preferred, backend has both or one
    return apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        password: data.oldPassword, // Fallback keys
        password_confirmation: data.newPassword,
      },
    });
  },

  // 8. Logout User
  async logout() {
    const rToken = getRefreshToken();
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
        body: {
          refreshToken: rToken,
        },
      });
    } catch (e) {
      console.warn('Backend logout request failed or bypassed:', e);
    } finally {
      clearTokens();
    }
  },
};

export const detectionService = {
  async verifyVideoLink(videoUrl: string) {
    return apiRequest('/api/detection/video-link', {
      method: 'POST',
      body: { videoUrl },
    });
  }
};

