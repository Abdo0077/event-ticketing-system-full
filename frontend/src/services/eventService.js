import api from './api';

export const eventService = {
  getAllEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEventById: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyEvents: async () => {
    try {
      const response = await api.get('/events/organizer/my-events');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEventAnalytics: async () => {
    try {
      const response = await api.get('/events/organizer/analytics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateEventStatus: async (id, status) => {
    try {
      const response = await api.put(`/events/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating event status:', error);
      throw error.response?.data || error.message;
    }
  },

  approveEvent: async (id) => {
    try {
      const response = await api.put(`/events/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving event:', error);
      throw error.response?.data || error.message;
    }
  },

  disapproveEvent: async (id) => {
    try {
      const response = await api.put(`/events/${id}/disapprove`);
      return response.data;
    } catch (error) {
      console.error('Error disapproving event:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default eventService; 