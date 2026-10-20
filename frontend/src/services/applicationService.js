import { apiClient } from './apiClient';

export const applicationService = {
  // Candidate: Apply for a job opening
  async applyForJob({ jobId, resume, coverLetter }) {
    const cleanId = String(jobId).replace('job-', '');
    return apiClient('/api/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId: cleanId, resume, coverLetter })
    });
  },

  // Candidate: Get own submitted applications
  async getMyApplications() {
    return apiClient('/api/applications/my', {
      method: 'GET'
    });
  },

  // HR / Admin: Get applications list with filters
  async getApplications(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/api/applications?${query}` : '/api/applications';
    return apiClient(endpoint, {
      method: 'GET'
    });
  },

  // HR / Admin: Update application status in 5-stage stepper
  async updateApplicationStatus(id, status) {
    const cleanId = String(id).replace('app-', '');
    return apiClient(`/api/applications/${encodeURIComponent(cleanId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
};

export default applicationService;
