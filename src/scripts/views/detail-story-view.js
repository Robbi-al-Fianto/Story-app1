// src/scripts/views/detail-story-view.js
import MapView from './components/map-view.js';

export default class DetailStoryView {
  constructor(template) {
    this.template = template;
    this.map      = null;
  }

  // Dipanggil di StoryPage.afterRender
  renderBaseTemplate() {
    document.querySelector('#main-content').innerHTML = this.template.detailTemplate();
  }

  showLoading() {
    const container = document.querySelector('.story-detail');
    if (container) container.classList.add('loading');
  }

  hideLoading() {
    const container = document.querySelector('.story-detail');
    if (container) container.classList.remove('loading');
  }

  showError(message) {
    document.querySelector('#main-content').innerHTML = `
      <div class="error">
        <h2>Error</h2>
        <p>${message}</p>
      </div>
    `;
  }

  renderStory(story) {
    document.getElementById('story-title').textContent = story.name;
    const img = document.getElementById('story-image');
    img.src = story.photoUrl;
    img.alt = story.name;
    document.getElementById('story-desc').textContent = story.description;
    document.getElementById('story-date').textContent = new Date(story.createdAt).toLocaleString();
  }

  renderMap(lat, lon) {
    if (this.map) this.map.remove();
    this.map = L.map('story-map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(this.map);
    L.marker([lat, lon]).addTo(this.map);
  }

  bindCommentSubmit(handler) {
    document.getElementById('commentForm')
      .addEventListener('submit', e => {
        e.preventDefault();
        const txt = document.getElementById('comment-input').value.trim();
        handler(txt);
      });
  }

   bindCommentDelete(handler) {
     document.getElementById('comment-list').addEventListener('click', e => {
      if (e.target.matches('.delete-comment')) {
         const cid = e.target.dataset.cid;
         handler(cid);
      }
     });
   }

  renderComments(comments) {
    const list = document.getElementById('comment-list');
    if (!comments.length) {
      list.innerHTML = '<li>Belum ada komentar.</li>';
      return;
    }
    list.innerHTML = comments.map(c => `
      <li class="comment-item" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
        <div>  
      <strong>${c.author}</strong>
      <small style="margin-left:0.5rem;color:#666;"> ${new Date(c.createdAt).toLocaleString()}</small>
        <p style="margin:0.5rem 0 0 0;">${c.text}</p>
        </div>
       <button class="btn btn-sm btn-danger delete-comment" data-cid="${c.cid}" style="margin-left:1rem;align-self:flex-start;">🗑️</button>
      </li>
    `).join('');
  }

  clearCommentInput() {
    document.getElementById('comment-input').value = '';
  }
}
