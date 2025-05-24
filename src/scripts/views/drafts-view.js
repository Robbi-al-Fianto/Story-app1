// src/scripts/views/drafts-view.js
export default class DraftsView {
    constructor(template) {
      this.template = template;
    }
  
    renderDrafts(drafts) {
      const container = document.querySelector('.draft-list');
      if (!drafts.length) {
        container.innerHTML = '<p>Tidak ada draft.</p>';
        return;
      }
      container.innerHTML = drafts
        .map(d => this.template.card(d))
        .join('');
  
      // bind delete buttons
      drafts.forEach(d => {
        const btn = document.getElementById(`delete-${d.id}`);
        btn.addEventListener('click', () => this.onDelete(d.id));
      });
    }
  
    bindDelete(handler) {
      this.onDelete = handler;
    }
  }
  