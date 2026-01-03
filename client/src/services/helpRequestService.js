import api from './api';

const helpRequestService = {
  // Create a new help request
  async createHelpRequest(helpRequestData) {
    try {
      const response = await api.post('/help-requests', helpRequestData);
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating help request:', error);
      throw error;
    }
  },

  // Get help requests by user ID
  async getHelpRequestsByUser(userId) {
    try {
      const response = await api.get(`/help-requests/user/${userId}`);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching help requests:', error);
      return [];
    }
  }
};

export default helpRequestService;

