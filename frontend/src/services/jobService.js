import { apiClient } from './apiClient';

export const jobService = {
  // Fetch live jobs from MySQL (token-aware: admin sees all, hr sees own+approved, seeker sees approved)
  async fetchJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/api/jobs?${query}` : '/api/jobs';
    return apiClient(endpoint, { method: 'GET' });
  },

  // Fetch recruiter's own posted jobs
  async fetchMyJobs() {
    return apiClient('/api/jobs/my', { method: 'GET' });
  },

  // Create new job opening (HR only, status=Pending)
  async createJob(jobData) {
    return apiClient('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  // Super Admin: Approve job opening
  async approveJob(jobId) {
    const cleanId = String(jobId).replace('job-', '');
    return apiClient(`/api/jobs/${encodeURIComponent(cleanId)}/approve`, {
      method: 'PUT'
    });
  },

  // Super Admin: Reject job opening
  async rejectJob(jobId) {
    const cleanId = String(jobId).replace('job-', '');
    return apiClient(`/api/jobs/${encodeURIComponent(cleanId)}/reject`, {
      method: 'PUT'
    });
  }
};

export default jobService;
