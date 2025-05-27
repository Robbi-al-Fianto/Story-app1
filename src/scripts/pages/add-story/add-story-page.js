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

    // Tambahkan integrasi draft di presenter
    // this.presenter.saveDraft = this.#saveDraft.bind(this);
    // this.presenter.loadDrafts = this.#loadDrafts.bind(this);
    // this.presenter.deleteDraft = this.#deleteDraft.bind(this);

    return this.presenter;
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.presenter.init();

  //   // Tampilkan daftar draft jika ada
  //   const drafts = await getAllDrafts();
  //   const draftListContainer = document.querySelector('#draft-list');
  //   if (draftListContainer && drafts.length) {
  //     draftListContainer.innerHTML = drafts.map(d => `
  //       <div class="draft-item">
  //         <p>${d.description}</p>
  //         <button class="use-draft" data-id="${d.id}">Gunakan</button>
  //         <button class="delete-draft" data-id="${d.id}">Hapus</button>
  //       </div>
  //     `).join('');

  //     draftListContainer.addEventListener('click', async (e) => {
  //       const id = e.target.dataset.id;
  //       if (e.target.classList.contains('use-draft')) {
  //         const draft = drafts.find(d => d.id === id);
  //         if (draft) {
  //           document.querySelector('#description').value = draft.description;
  //           if (draft.lat && draft.lon) {
  //             document.querySelector('#lat').value = draft.lat;
  //             document.querySelector('#lon').value = draft.lon;
  //           }
  //         }
  //       }

  //       if (e.target.classList.contains('delete-draft')) {
  //         await this.#deleteDraft(id);
  //         window.location.reload();
  //       }
  //     });
  //   }
  // }

  // async #saveDraft(data) {
  //   const draft = {
  //     id: uuidv4(),
  //     ...data,
  //     createdAt: new Date().toISOString()
  //   };
  //   await saveDraft(draft);
  // }

  // async #loadDrafts() {
  //   return await getAllDrafts();
  // }

  // async #deleteDraft(id) {
  //   return await deleteDraft(id);
  // }
}}
