// src/scripts/pages/story/story-page.js
import StoryTemplate from '../../templates/story-template.js';
import DetailStoryView from '../../views/detail-story-view.js';
import DetailStoryPresenter from '../../presenters/detail-story-presenter.js';
import { parseActivePathname } from '../../routes/url-parser.js';

export default class StoryPage {
  constructor() {
    this.template  = new StoryTemplate();
    this.view      = new DetailStoryView(this.template);
    this.presenter = null;
  }

  initPresenter(deps) {
    this.presenter = new DetailStoryPresenter(this.view, deps);
    return this.presenter;
  }

  async render() {
    // tampilkan placeholder HTML
    return this.template.detailTemplate();
  }

  async afterRender() {
    // ambil ID dari URL, lalu inisialisasi presenter
    const { id } = parseActivePathname();
    await this.presenter.initialize(id);
  }
}
