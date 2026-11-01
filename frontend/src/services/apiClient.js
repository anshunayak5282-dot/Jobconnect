// Central API fetch client for JobConnect
// Resolves all API requests against the Render backend using import.meta.env.VITE_API_URL

const DEFAULT_BACKEND_URL = 'https://jobconnect-yrpp.onrender.com';

/**
 * Normalizes and builds the target API URL.
 * Prevents duplicate /api segments and eliminates trailing slashes.
 * 
 * @param {string} endpoint - Target path or full URL (e.g., '/api/auth/login', 'jobs')
 * @returns {string} Fully qualified URL pointing to backend API
 */
export const getApiUrl = (endpoint = '') => {
  if (!endpoint && endpoint !== '') return '';
  const trimmedEndpoint = String(endpoint).trim();

  // If already an absolute URL (http:// or https://), return as-is
  if (/^https?:\/\//i.test(trimmedEndpoint)) {
    return trimmedEndpoint;
  }

  // Base URL from environment variable, falling back to Render backend
  const rawBase = (import.meta.env.VITE_API_URL || DEFAULT_BACKEND_URL).trim();

  // Normalize base: strip trailing slashes, then strip any trailing /api
  let normalizedBase = rawBase.replace(/\/+$/, '');
  normalizedBase = normalizedBase.replace(/\/api$/, '');

  // Normalize endpoint: ensure leading slash
  let path = trimmedEndpoint.startsWith('/') ? trimmedEndpoint : `/${trimmedEndpoint}`;

  // If path is root / or health check
  if (path === '/' || path === '') {
    return normalizedBase ? `${normalizedBase}/` : '/';
  }

  // Ensure path starts with /api (backend Express routes are mounted under /api/...)
  if (!path.startsWith('/api/') && path !== '/api') {
    path = `/api${path}`;
  }

  return `${normalizedBase}${path}`;
};

/**
 * Central API client for all frontend requests.
 * Automatically injects authorization tokens and headers.
 * 
 * @param {string} endpoint - API path or full URL
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @returns {Promise<{ ok: boolean, status: number, data: any, headers: Headers, json: () => Promise<any>, text: () => Promise<string>, rawResponse: Response }>}
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jobconnect_token') : null;
  const fullUrl = getApiUrl(endpoint);

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  } else {
    const text = await response.text();
    data = { success: response.ok, message: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: response.headers,
    data,
    json: async () => data,
    text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
    rawResponse: response
  };
};

export const apiFetch = apiClient;
export default apiClient;
