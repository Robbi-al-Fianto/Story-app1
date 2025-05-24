import { saveStoriesToDb, getStoriesFromDb } from '../utils/db.js';

export default class HomePresenter {
  constructor(view, storyService) {
    this.view         = view;
    this.storyService = storyService;
  }

  async initialize() {
    const token   = localStorage.getItem('token');
    const isGuest = !token && localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      // tidak fetch stories saat guest, tapi tetap sembunyikan loading
      return;
    }

    this.view.showLoading();
    try {
      // 1) network–first
      const stories = await this.storyService.getAllStories({ location: 1 });
      // 2) simpan ke IndexedDB
      await saveStoriesToDb(stories);
      // 3) render seperti biasa
      this.view.initializeMap(stories);
      this.view.renderStories(stories);
    } catch (err) {
      // fallback: baca dari cache
      const cached = await getStoriesFromDb();
      if (cached.length) {
        this.view.initializeMap(cached);
        this.view.renderStories(cached);
      } else {
        this.view.showError('Tidak dapat memuat cerita, coba lagi nanti.');
      }
    } finally {
      this.view.hideLoading();
    }
  }

  async cleanup() {
    this.view.mapView?.destroy();
  }


}
