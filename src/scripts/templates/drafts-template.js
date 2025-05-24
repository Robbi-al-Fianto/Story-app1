// src/scripts/templates/drafts-template.js
export default class DraftsTemplate {
    render() {
      return `
        <section class="container">
          <h1 class="page-title">Drafts Anda</h1>
          <div class="draft-list"></div>
        </section>
      `;
    }
  
    card(d) {
      return `
        <article class="draft-card">
          <p><strong>Deskripsi:</strong> ${d.description}</p>
          <p><strong>Dibuat:</strong> ${new Date(d.createdAt).toLocaleString()}</p>
          <button id="delete-${d.id}" class="btn btn-danger">Hapus Draft</button>
        </article>
      `;
    }
  }
  