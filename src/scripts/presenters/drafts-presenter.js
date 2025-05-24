// src/scripts/presenters/drafts-presenter.js
import { getAllDrafts, deleteDraft } from '../utils/db.js';

export default class DraftsPresenter {
  constructor(view) {
    this.view = view;
    // bind handler delete
    this.view.bindDelete(this.handleDelete.bind(this));
  }

  async loadDrafts() {
    const drafts = await getAllDrafts();
    this.view.renderDrafts(drafts);
  }

  async handleDelete(id) {
    await deleteDraft(id);
    // reload list setelah hapus
    await this.loadDrafts();
  }
}
