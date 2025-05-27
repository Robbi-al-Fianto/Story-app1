// src/scripts/pages/add-story/add-story-page.js
import AddStoryTemplate    from '../../templates/story-template.js';
import AddStoryView        from '../../views/story-view.js';
import AddStoryPresenter   from '../../presenters/story-presenter.js';
// import { saveDraft, getAllDrafts, deleteDraft } from '../../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export default class AddStoryPage {
  constructor() {
    this.template  = new AddStoryTemplate();
    this.view      = new AddStoryView(this.template);
    this.presenter = null;
  }

  initPresenter({ storyService, navigate }) {
    this.presenter = new AddStoryPresenter(this.view, { storyService, navigate });


    return this.presenter;
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.presenter.init();

}}
