// src/scripts/templates/liked-template.js - Updated with auth states
export default class LikedTemplate {
  render() {
    return `
      <section class="container">
        <h1 class="page-title">💖 Cerita Favorit</h1>
        <div id="success-message" class="success-message" style="display: none;"></div>
        <div class="liked-story-list"></div>
      </section>
    `;
  }

  card(story) {
    return `
      <article class="liked-story-card">
        <img src="${story.photoUrl}" alt="Foto sampul cerita “${story.name}”" class="story-image" loading="lazy">
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <div class="story-meta">
            <time class="story-date">
              Dibuat: ${new Date(story.createdAt).toLocaleString('id-ID')}
            </time>
            <small class="liked-date">
              Disukai: ${new Date(story.likedAt).toLocaleString('id-ID')}
            </small>
          </div>
          <div class="story-actions">
            <a href="#/stories/${story.id}" class="btn btn-primary btn-sm">
              Lihat Detail
            </a>
            <button id="remove-${story.id}" class="btn btn-danger btn-sm" title="Hapus dari favorit">
              🗑️ Hapus dari Favorit
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
    const isAuthError = message.includes('login');
    
    return `
      <div class="error-state">
        <div class="error-icon">${isAuthError ? '🔒' : '😞'}</div>
        <h3>${isAuthError ? 'Akses Ditolak' : 'Terjadi Kesalahan'}</h3>
        <p>${message}</p>
        <div class="error-actions">
          ${isAuthError ? 
            `<a href="#/login" class="btn btn-primary">Login Sekarang</a>` :
            `<button onclick="window.location.reload()" class="btn btn-secondary">Coba Lagi</button>`
          }
          <a href="#/" class="btn btn-secondary">Kembali ke Beranda</a>
        </div>
      </div>
    `;
  }

  successMessage(message) {
    return `
      <div class="alert alert-success">
        <span class="success-icon">✅</span>
        ${message}
      </div>
    `;
  }

  authRequiredState() {
    return `
      <div class="auth-required-state">
        <div class="auth-icon">🔐</div>
        <h3>Login Diperlukan</h3>
        <p>Anda harus login terlebih dahulu untuk melihat cerita favorit Anda.</p>
        <div class="auth-actions">
          <a href="#/login" class="btn btn-primary">Login</a>
          <a href="#/register" class="btn btn-secondary">Daftar</a>
          <a href="#/" class="btn btn-outline">Kembali ke Beranda</a>
        </div>
      </div>
    `;
  }
}