// Re-export central apiClient and helpers to maintain a single source of truth
import { apiClient, getApiUrl, apiFetch } from './apiClient';

export { apiClient, getApiUrl, apiFetch };
export default apiClient;
