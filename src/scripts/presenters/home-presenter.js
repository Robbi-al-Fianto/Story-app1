import { saveStoriesToDb, getStoriesFromDb } from '../utils/db.js';
import { saveLikedStory, removeLikedStory, isStoryLiked,} from '../utils/db.js';

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

      const imgCache = await caches.open('story-imgs');
      await Promise.all(
        stories.map((s) => {
          // hanya cache jika belum ada
          return imgCache.match(s.photoUrl)
            .then(hit => hit || imgCache.add(s.photoUrl));
        })
      );
      // 3) render seperti biasa
      this.view.initializeMap(stories);
        // sebelum renderStories, cek status liked per story
      const likeStates = await Promise.all(
        stories.map(s => isStoryLiked(s.id))
      );
      this.view.renderStories(stories, likeStates);
  // bind tombol like
      this.view.bindLikeButtons(this._handleLike.bind(this));
      
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
   async _handleLike(storyId, currentlyLiked) {
       if (currentlyLiked) {
         await removeLikedStory(storyId);
         document.dispatchEvent(new CustomEvent('story-unliked', { detail: { storyId } }));
       } else {
         // dapatkan data story lengkap (misal dari cache stories)
         const story = (await getStoriesFromDb()).find(s => s.id === storyId);
         if (story) {
           await saveLikedStory(story);
           document.dispatchEvent(new CustomEvent('story-liked', { detail: { storyId } }));
         }
       }
       // update state tombol di UI
       this.view.updateLikeButton(storyId, !currentlyLiked);
     }
    
}

