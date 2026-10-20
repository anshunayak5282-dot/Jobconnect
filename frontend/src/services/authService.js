import { apiClient } from './apiClient';

export const authService = {
  // Login with credentials and authorized role
  async login({ email, password, role }) {
    return apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  },

  // Register new candidate or HR account
  async register({ name, email, phone, password, role, company }) {
    return apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, role, company })
    });
  },

  // Verify active JWT token & anti-role spoofing check
  async getMe() {
    return apiClient('/api/auth/me', {
      method: 'GET'
    });
  }
};

export default authService;
