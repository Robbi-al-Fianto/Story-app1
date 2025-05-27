// src/scripts/pages/liked/liked-page.js
import LikedTemplate   from '../../templates/liked-template.js';
import LikedView       from '../../views/liked-view.js';
import LikedPresenter  from '../../presenters/liked-presenter.js';

export default class LikedPage {
  constructor() {
    this.template  = new LikedTemplate();
    this.view      = new LikedView(this.template);
    this.presenter = new LikedPresenter(this.view);
  }

  initPresenter() {
    return this.presenter;
  }

  async render() {
    // kembalikan HTML shell
    return this.template.render();
  }

  async afterRender() {
    // load & render liked stories
    await this.presenter.loadLikedStories();
  }
}