// src/scripts/presenters/home-presenter.js
import {
    saveStoriesToDb,
    getStoriesFromDb,
    saveLikedStory,
    removeLikedStory,
    isStoryLiked,
    getAllLikedStories,
  } from '../utils/db.js';

export default class HomePresenter {
  constructor(view, storyService) {
    this.view         = view;
    this.storyService = storyService;

    document.addEventListener('story-liked', e => {
      this.view.updateLikeButton(e.detail.storyId, true);
    });
    document.addEventListener('story-unliked', e => {
      this.view.updateLikeButton(e.detail.storyId, false);
    });
  }

  async initialize() {
    const token   = localStorage.getItem('token');
    const isGuest = !token && localStorage.getItem('isGuest') === 'true';
    if (isGuest) return;

    this.view.showLoading();

     let stories = await getStoriesFromDb();
    if (stories.length) {
      const likeStates = await Promise.all(
        stories.map(s => isStoryLiked(s.id))
      );
      this.view.initializeMap(stories);
      this.view.renderStories(stories, likeStates);
      this.view.bindLikeButtons(this._handleLike.bind(this));
      const allLiked = await getAllLikedStories();
+      allLiked.forEach(l => this.view.updateLikeButton(l.storyId, true));
    }


    try {
      const fresh = await this.storyService.getAllStories({ location: 1 });
      await saveStoriesToDb(fresh);

      const imgCache = await caches.open('story-imgs');
      await Promise.all(fresh.map(s =>
        imgCache.match(s.photoUrl).then(hit => hit || imgCache.add(s.photoUrl))
      ));

      const likeStates = await Promise.all(
        fresh.map(s => isStoryLiked(s.id))
      );
      // Inisialisasi ulang map & stories
      this.view.initializeMap(fresh);
      this.view.renderStories(fresh, likeStates);
      this.view.bindLikeButtons(this._handleLike.bind(this));

       // Fixup lagi setelah render network
      const allLiked2 = await getAllLikedStories();
      allLiked2.forEach(l => this.view.updateLikeButton(l.storyId, true));
    } catch (err) {
      // jika tidak ada cache sama sekali, tampilkan error
      if (!stories.length) {
        this.view.showError('Tidak dapat memuat cerita, coba lagi nanti.');
      }
    } finally {
      this.view.hideLoading();
    }
  }

  async _handleLike(storyId, currentlyLiked) {
    if (currentlyLiked) {
      await removeLikedStory(storyId);
      this.view.updateLikeButton(storyId, false);
    } else {
      const story = (await getStoriesFromDb()).find(s => s.id === storyId);
      if (!story) return;
      await saveLikedStory(story);
      this.view.updateLikeButton(storyId, true);
    }
  }
}
