import api from './api';

const storyService = {
  // Get all stories
  async getAllStories() {
    try {
      const response = await api.get('/stories');
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      return [];
    }
  },

  // Get story by ID
  async getStoryById(id) {
    try {
      const response = await api.get(`/stories/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  },

  // Get stories by user ID
  async getStoriesByUserId(userId) {
    try {
      const response = await api.get(`/stories/user/${userId}`);
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching user stories:', error);
      return [];
    }
  },

  // Create a new story
  async createStory(storyData) {
    try {
      const response = await api.post('/stories', storyData);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  // Update story
  async updateStory(id, updates) {
    try {
      const response = await api.patch(`/stories/${id}`, updates);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  },

  // Delete story
  async deleteStory(id) {
    try {
      const response = await api.delete(`/stories/${id}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  },

  // Like a story
  async likeStory(id) {
    try {
      const response = await api.post(`/stories/${id}/like`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error liking story:', error);
      throw error;
    }
  },

  // Unlike a story
  async unlikeStory(id) {
    try {
      const response = await api.post(`/stories/${id}/unlike`);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error unliking story:', error);
      throw error;
    }
  }
};

export default storyService;

