// src/scripts/pages/404/404-page.js
export default class NotFoundPage {
  async render() {
    return `
      <div class="error-page">
        <div class="error-content">
          <h1 class="error-title">404</h1>
          <h2 class="error-subtitle">Halaman Tidak Ditemukan</h2>
          <p class="error-description">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>
          <a href="#/" class="home-link">
            <i class="fas fa-home"></i> Kembali ke Beranda
          </a>
        </div>
      </div>
    `;
  }

  // Method yang diperlukan oleh app.js
  initPresenter(dependencies) {
    // 404 page tidak memerlukan presenter yang kompleks
    // Return objek kosong atau null untuk konsistensi
    return {
      cleanup: () => {
        // Cleanup jika diperlukan
      }
    };
  }

  async afterRender() {
    // Tambahkan styling untuk 404 page jika diperlukan
    this.#addStyles();
  }

  #addStyles() {
    // Tambah style inline jika belum ada di CSS global
    const style = document.createElement('style');
    style.textContent = `
      .error-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
        text-align: center;
        padding: 2rem;
      }
      
      .error-content {
        max-width: 500px;
      }
      
      .error-title {
        font-size: 6rem;
        font-weight: bold;
        color: #ff6b6b;
        margin: 0;
        line-height: 1;
      }
      
      .error-subtitle {
        font-size: 1.5rem;
        color: #333;
        margin: 1rem 0;
      }
      
      .error-description {
        color: #666;
        margin: 1.5rem 0;
        line-height: 1.6;
      }
      
      .home-link {
        display: inline-block;
        background: #007bff;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        transition: background-color 0.3s ease;
        margin-top: 1rem;
      }
      
      .home-link:hover {
        background: #0056b3;
        color: white;
      }
      
      .home-link i {
        margin-right: 8px;
      }
    `;
    
    // Hanya tambahkan jika belum ada
    if (!document.querySelector('#error-page-styles')) {
      style.id = 'error-page-styles';
      document.head.appendChild(style);
    }
  }
}