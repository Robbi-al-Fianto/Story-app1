import MapView from './components/map-view.js';

export default class HomeView {
  constructor(template) {
    this.template = template;
    this.mapView  = null;
  }

  bindAddButton(onClick) {
    document.addEventListener('click', e => {
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

  renderStories(stories) {
    const grid = document.querySelector('.story-grid');
    if (!grid) return;
    grid.innerHTML = stories.length
      ? stories.map(s => this.template.storyCard(s)).join('')
      : '<p>Belum ada cerita.</p>';
  }

  initializeMap(stories) {
    if (!this.mapView) {
      this.mapView = new MapView('map', { center: [-6.2000,106.8166], zoom: 5 });
    }
    this.mapView.init();
    const items = stories.map(s => ({
      lat: s.lat, lon: s.lon,
      popupHtml: `<b>${s.name}</b><br>${s.description}`
    }));
    this.mapView.addMarkers(items);
  }
}
