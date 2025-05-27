// src/scripts/views/liked-view.js - Updated with success messages
export default class LikedView {
  constructor(template) {
    this.template = template;
  }

  renderLikedStories(likedStories) {
    const container = document.querySelector('.liked-story-list');
    if (!container) return;

    if (!likedStories.length) {
      container.innerHTML = this.template.emptyState();
      return;
    }

    container.innerHTML = likedStories
      .map(story => this.template.card(story))
      .join('');

    likedStories.forEach(story => {
      const btn = document.getElementById(`remove-${story.id}`);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.onRemove(story.id);
        });
      }
    });
  }

  removeCard(storyId) {
    const btn = document.getElementById(`remove-${storyId}`);
    if (!btn) return;
    const card = btn.closest('.liked-story-card');
    if (card) card.remove();
  }

  showError(message) {
    const container = document.querySelector('.liked-story-list');
    if (container) {
      container.innerHTML = this.template.errorState(message);
    }
  }

  showSuccessMessage(message) {
    const successElement = document.getElementById('success-message');
    if (successElement) {
      successElement.innerHTML = this.template.successMessage(message);
      successElement.style.display = 'block';
      
      setTimeout(() => {
        successElement.style.display = 'none';
      }, 3000);
    }
  }

  showAuthRequired() {
    const container = document.querySelector('.liked-story-list');
    if (container) {
      container.innerHTML = this.template.authRequiredState();
    }
  }

  bindRemove(handler) {
    this.onRemove = handler;
  }
}