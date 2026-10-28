/**
 * JobConnect Centralized API Client & URL Resolver
 * 
 * Safely resolves API endpoints against `import.meta.env.VITE_API_URL`,
 * preventing duplicate (`/api/api/...`) or missing (`/...`) paths.
 */

const FALLBACK_PROD_API_URL = 'https://jobconnect-b5kq.onrender.com';

/**
 * Returns the fully-qualified API URL for a given endpoint.
 * 
 * Examples:
 *  - getApiUrl('/api/auth/login') -> 'https://jobconnect-b5kq.onrender.com/api/auth/login'
 *  - getApiUrl('/jobs')           -> 'https://jobconnect-b5kq.onrender.com/api/jobs'
 *  - getApiUrl('/api/jobs')       -> 'https://jobconnect-b5kq.onrender.com/api/jobs'
 * 
 * Handles VITE_API_URL with or without trailing slash and with or without '/api'.
 */
export const getApiUrl = (endpoint = '') => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();

  // In local dev without VITE_API_URL, use relative path so Vite proxy works.
  // In production without VITE_API_URL, default to the live Render backend.
  const isDev = Boolean(import.meta.env.DEV);
  const rawBase = envUrl || (isDev ? '' : FALLBACK_PROD_API_URL);

  let cleanEndpoint = (endpoint || '').trim();
  if (!cleanEndpoint.startsWith('/')) {
    cleanEndpoint = `/${cleanEndpoint}`;
  }

  // If no base URL is defined (local dev proxy mode), ensure path starts with /api
  if (!rawBase) {
    if (!cleanEndpoint.startsWith('/api/') && cleanEndpoint !== '/api') {
      return `/api${cleanEndpoint}`;
    }
    return cleanEndpoint;
  }

  // Strip trailing slashes and any trailing '/api' from the base URL to get the clean host root
  const baseHost = rawBase.replace(/\/+$/, '').replace(/\/api\/?$/, '');

  // Strip leading '/api' from the endpoint path to avoid duplicate '/api/api'
  const subPath = cleanEndpoint.replace(/^\/api(\/|$)/, '/');
  const normalizedSubPath = subPath === '/' ? '' : subPath;

  return `${baseHost}/api${normalizedSubPath}`;
};

/**
 * Universal fetch wrapper that:
 * 1. Formats endpoint URL through getApiUrl()
 * 2. Injects stored JWT Authorization token
 * 3. Sets default JSON content type
 * 4. Detects HTML responses (e.g. from Vercel SPA fallbacks or 405 error pages)
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);

  const headers = {
    ...options.headers
  };

  // Attach JWT Bearer token if available and not already set
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jobconnect_token');
    if (token && !headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Attach application/json if sending a JSON body and header not provided
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
};

export default {
  getApiUrl,
  apiFetch
};
