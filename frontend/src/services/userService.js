import { apiClient } from './apiClient';

export const userService = {
  // Fetch user profile by email from MySQL
  async getUserProfile(email) {
    return apiClient(`/api/users/profile/${encodeURIComponent(email)}`, {
      method: 'GET'
    });
  },

  // Update profile in MySQL (direct for Candidates; queues moderation request for HR)
  async updateProfile(fields) {
    return apiClient('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(fields)
    });
  },

  // Candidate: Upload resume file to server and MySQL
  async uploadResume({ fileName, fileData, fileSize, fileType }) {
    return apiClient('/api/users/resume', {
      method: 'POST',
      body: JSON.stringify({ fileName, fileData, fileSize, fileType })
    });
  },

  // Super Admin: Fetch all pending HR profile moderation requests
  async getProfileRequests() {
    return apiClient('/api/users/profile-requests', {
      method: 'GET'
    });
  },

  // HR: Fetch own profile moderation request
  async getMyProfileRequests() {
    return apiClient('/api/users/profile-requests/my', {
      method: 'GET'
    });
  },

  // Super Admin: Approve HR profile update request
  async approveProfileRequest(requestId) {
    return apiClient(`/api/users/profile-requests/${encodeURIComponent(requestId)}/approve`, {
      method: 'PUT'
    });
  },

  // Super Admin: Reject HR profile update request
  async rejectProfileRequest(requestId, reason) {
    return apiClient(`/api/users/profile-requests/${encodeURIComponent(requestId)}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }
};

export default userService;
