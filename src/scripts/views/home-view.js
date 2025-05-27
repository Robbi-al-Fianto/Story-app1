import MapView from './components/map-view.js';

export default class HomeView {
  constructor(template) {
    this.template = template;
    this.mapView = null;
  }

  bindAddButton(onClick) {
    document.addEventListener('click', (e) => {
      if (e.target.matches('#add-btn') || e.target.matches('#guest-add-btn')) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const isGuest = !token && localStorage.getItem('isGuest') === 'true';
        onClick(isGuest);
      }
    });
  }

  showLoading() {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'block';
  }

  hideLoading() {
    const loader = document.getElementById('loading');
    if (loader) loader.style.display = 'none';
  }

  showError(message) {
    const container = document.querySelector('.container');
    if (container) container.innerHTML = this.template.errorTemplate(message);
  }

  renderStories(stories, likeStates = []) {
    const grid = document.querySelector('.story-grid');
    if (!grid) return;

    grid.innerHTML = stories.length
      ? stories.map((s, idx) => this.template.storyCard(s, likeStates[idx])).join('')
      : '<p>Belum ada cerita.</p>';
  }

  /**
   * Pasang event listener ke semua tombol .like-button
   * @param {(storyId: string, currentlyLiked: boolean) => void} handler
   */
  bindLikeButtons(handler) {
    document.querySelectorAll('.like-button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const storyId = btn.dataset.storyId;
        const currentlyLiked = btn.classList.contains('liked');
        handler(storyId, currentlyLiked);
      });
    });
  }

  /**
   * Update UI tombol like setelah like/unlike
   */
  updateLikeButton(storyId, isNowLiked) {
    const btn = document.querySelector(`.like-button[data-story-id="${storyId}"]`);
    if (!btn) return;
    btn.classList.toggle('liked', isNowLiked);
    btn.querySelector('.like-icon').textContent = isNowLiked ? '❤️' : '🤍';
    btn.title = isNowLiked ? 'Hapus dari favorit' : 'Tambah ke favorit';
  }

  initializeMap(stories) {
    if (!this.mapView) {
      this.mapView = new MapView('map', { center: [-6.2000, 106.8166], zoom: 5 });
    }
    this.mapView.init();
    const items = stories.map((s) => ({
      lat: s.lat,
      lon: s.lon,
      popupHtml: `<b>${s.name}</b><br>${s.description}`,
    }));
    this.mapView.addMarkers(items);
  }
}
