// src/scripts/views/liked-view.js
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

    // bind remove buttons
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

  showError(message) {
    const container = document.querySelector('.liked-story-list');
    if (container) {
      container.innerHTML = this.template.errorState(message);
    }
  }

  bindRemove(handler) {
    this.onRemove = handler;
  }
}