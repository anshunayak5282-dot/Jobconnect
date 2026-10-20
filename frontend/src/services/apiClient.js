// Central API fetch client with automatic JWT token attachment and error handling
export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('jobconnect_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(endpoint, {
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
