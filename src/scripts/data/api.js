// src/scripts/data/api.js
import CONFIG from '../config';

/**
 * Helper untuk parse JSON dan throw error jika status bukan OK
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message ||
      (data.error ? `${data.error} - ${data.message}` : 'Request failed');
    throw new Error(errorMessage);
  }
  return data;
};

export const AuthService = {
  /**
   * Login user
   */
  async login({ email, password }) {
    const res = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    if (!data.loginResult?.token) {
      throw new Error('Invalid response structure');
    }
    return data;
  },

  /**
   * Register new user
   */
  async register({ name, email, password }) {
    const res = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  /**
   * Register push subscription
   * @param {PushSubscription} subscription
   */
  async registerPush(subscription) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const subJson = subscription.toJSON();
    const payload = {
      endpoint: subJson.endpoint,
      keys: subJson.keys,
    };

    const res = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  /**
   * Unregister push subscription
   */
  async unregisterPush() {
    const token = localStorage.getItem('token');
    const endpoint = localStorage.getItem('push-endpoint');
    if (!token || !endpoint) return;

    const res = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ endpoint }),
    });
    const data = await handleResponse(res);
    localStorage.removeItem('push-endpoint');
    return data;
  },
};

export const StoryService = {
  /**
   * Get all stories
   */
  async getAllStories({ page = 1, size = 20, location = 1 } = {}) {
    const token = localStorage.getItem('token');
    const url = new URL(`${CONFIG.BASE_URL}/stories`);
    url.searchParams.set('page', page);
    url.searchParams.set('size', size);
    url.searchParams.set('location', location);

    const res = await fetch(url.toString(), {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await handleResponse(res);
    return data.listStory || [];
  },

  /**
   * Get story by ID
   */
  async getStoryById(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    const data = await handleResponse(res);
    return data.story;
  },

  /**
   * Add story (authenticated)
   */
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

  /**
   * Add story as guest
   */
  async addStoryGuest(formData) {
    const res = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },
};
