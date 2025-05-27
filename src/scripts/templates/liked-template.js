// src/scripts/templates/liked-template.js
export default class LikedTemplate {
  render() {
    return `
      <section class="container">
        <h1 class="page-title">💖 Cerita Favorit</h1>
        <div class="liked-story-list"></div>
      </section>
    `;
  }

  card(story) {
    return `
      <article class="liked-story-card">
        <img src="${story.photoUrl}" alt="${story.name}" class="story-image">
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <div class="story-meta">
            <time class="story-date">
              ${new Date(story.createdAt).toLocaleString('id-ID')}
            </time>
            <small class="liked-date">
              Disukai: ${new Date(story.likedAt).toLocaleString('id-ID')}
            </small>
          </div>
          <div class="story-actions">
            <a href="#/stories/${story.id}" class="btn btn-primary btn-sm">
              Lihat Detail
            </a>
            <button id="remove-${story.id}" class="btn btn-danger btn-sm">
              Hapus dari Favorit
            </button>
          </div>
        </div>
      </article>
    `;
  }

  emptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">💔</div>
        <h3>Belum ada cerita favorit</h3>
        <p>Mulai menandai cerita yang kamu sukai dengan menekan tombol ❤️ di halaman utama!</p>
        <a href="#/" class="btn btn-primary">Jelajahi Cerita</a>
      </div>
    `;
  }

  errorState(message) {
    return `
      <div class="error-state">
        <div class="error-icon">😞</div>
        <h3>Terjadi Kesalahan</h3>
        <p>${message}</p>
        <button onclick="window.location.reload()" class="btn btn-secondary">
          Coba Lagi
        </button>
      </div>
    `;
  }
}