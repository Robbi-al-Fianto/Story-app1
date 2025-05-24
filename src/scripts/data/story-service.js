import CONFIG from '../config';
import { handleResponse } from './api';

export const StoryService = {
  // ambil semua story, langsung kembalikan array listStory
  async getAllStories() {
    const token = localStorage.getItem('token');
    const endpoint = token ? '/stories' : '/stories/public';
    const res = await fetch(`${CONFIG.BASE_URL}${endpoint}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await handleResponse(res);
    return data.listStory;     // kembalikan langsung array
  },

  // ambil detail story berdasarkan ID
  async getStoryById(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await handleResponse(res);
    return data.story;         // kembalikan objek story
  },

  // (optional) tambah story
  async addStory(formData) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    const res = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    return handleResponse(res);
  },

  async addStoryGuest(formData) {
    const res = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },
};
