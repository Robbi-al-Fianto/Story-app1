// src/scripts/pages/drafts/drafts-page.js
import DraftsTemplate   from '../../templates/drafts-template.js';
import DraftsView       from '../../views/drafts-view.js';
import DraftsPresenter  from '../../presenters/drafts-presenter.js';

export default class DraftsPage {
  constructor() {
    this.template  = new DraftsTemplate();
    this.view      = new DraftsView(this.template);
    this.presenter = new DraftsPresenter(this.view);
  }

  initPresenter() {
    return this.presenter;
  }

  async render() {
    // kembalikan HTML shell
    return this.template.render();
  }

  async afterRender() {
    // load & render data draft
    await this.presenter.loadDrafts();
  }
}
