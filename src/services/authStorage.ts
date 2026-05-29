/**
 * Web implementation of auth storage using localStorage and Cookies
 */

const ACCESS_TOKEN_KEY = 'homeorbit_access_token';
const REFRESH_TOKEN_KEY = 'homeorbit_refresh_token';
const USER_KEY = 'homeorbit_user';

export const authStorage = {
  saveAuthData: async ({ accessToken, refreshToken, user }: { accessToken?: string; refreshToken?: string; user?: any }) => {
    if (typeof window === 'undefined') return;

    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // Also set as cookie for SSR if needed later
    if (accessToken) document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=31536000; samesite=lax`;
  },

  getAccessToken: async () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: async () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser: async () => {
    if (typeof window === 'undefined') return null;
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },

  getSession: async () => {
    const accessToken = await authStorage.getAccessToken();
    const refreshToken = await authStorage.getRefreshToken();
    return { accessToken, refreshToken };
  },

  clearAuthData: async () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
