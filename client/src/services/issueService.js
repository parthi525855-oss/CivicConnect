import api from './api';

export const issueService = {
  async getIssues(params = {}) {
    const response = await api.get('/issues', { params });
    return response.data;
  },

  async getIssueById(id) {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  async createIssue(formData) {
    const isFormData = formData instanceof FormData;
    const response = await api.post('/issues', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async updateIssue(id, formData) {
    const isFormData = formData instanceof FormData;
    const response = await api.put(`/issues/${id}`, formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    return response.data;
  },

  async deleteIssue(id) {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  },

  async updateStatus(id, { status, adminRemark }) {
    const response = await api.patch(`/issues/${id}/status`, { status, adminRemark });
    return response.data;
  },

  async updatePriority(id, { priority, reason }) {
    const response = await api.patch(`/issues/${id}/priority`, { priority, reason });
    return response.data;
  },

  async upvoteIssue(id) {
    const response = await api.post(`/issues/${id}/upvote`);
    return response.data;
  }
};
