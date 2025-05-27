// src/scripts/presenters/liked-presenter.js
import { getAllLikedStories, removeLikedStory } from '../utils/db.js';

export default class LikedPresenter {
  constructor(view) {
    this.view = view;
    // bind handler remove
    this.view.bindRemove(this.handleRemove.bind(this));
  }

  async loadLikedStories() {
    try {

      const hasToken = !!localStorage.getItem('token');
      if (!hasToken) {
        this.view.showAuthRequired();
        return;
      }

      const likedStories = await getAllLikedStories();
      this.view.renderLikedStories(likedStories);
      
    } catch (error) {
      console.error('Error loading liked stories:', error);
      
      if (error.message.includes('logged in')) {
        this.view.showAuthRequired();
      } else {
        this.view.showError('Gagal memuat cerita yang disukai: ' + error.message);
      }
    }
  }

  async handleRemove(storyId) {
    try {

      const hasToken = !!localStorage.getItem('token');
      if (!hasToken) {
        alert('Anda harus login untuk menghapus cerita favorit');
        window.location.hash = '/login';
        return;
      }

      const confirmed = confirm('Apakah Anda yakin ingin menghapus cerita ini dari daftar favorit?');
      if (!confirmed) return;
  
      await removeLikedStory(storyId);
  
      await this.loadLikedStories();
  
      this.view.showSuccessMessage('Cerita berhasil dihapus dari daftar favorit!');

      document.dispatchEvent(new CustomEvent('story-unliked', { detail: { storyId } }));
    } catch (error) {
      console.error('Error removing liked story:', error);
      alert('Gagal menghapus cerita dari daftar favorit: ' + error.message);
    }
  }
}