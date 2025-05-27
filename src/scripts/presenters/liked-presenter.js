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
      const likedStories = await getAllLikedStories();
      this.view.renderLikedStories(likedStories);
    } catch (error) {
      console.error('Error loading liked stories:', error);
      this.view.showError('Gagal memuat cerita yang disukai');
    }
  }

  async handleRemove(storyId) {
    try {
      await removeLikedStory(storyId);
      // reload list setelah hapus
      await this.loadLikedStories();
      
      // dispatch event untuk update UI di home jika ada
      document.dispatchEvent(new CustomEvent('story-unliked', { 
        detail: { storyId } 
      }));
    } catch (error) {
      console.error('Error removing liked story:', error);
      alert('Gagal menghapus cerita dari daftar favorit');
    }
  }
}