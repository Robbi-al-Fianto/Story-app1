export default class MapPresenter {
  constructor(view, storyService) {
    this.view = view;
    this.storyService = storyService;
  }

  async init() {
    try {
      const stories = await this.storyService.getAllStories();
      this.view.initializeMap(stories);
    } catch (e) {
      console.error('Map load failed:', e);
    }
  }
}
