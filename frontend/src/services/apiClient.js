
// Central API fetch client
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('jobconnect_token');

  // Build the correct API URL
  const url = /^https?:\/\//i.test(endpoint)
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { success: response.ok, message: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    data
  };
};

export default apiClient;
