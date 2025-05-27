// src/scripts/views/detail-story-view.js
import MapView from './components/map-view.js';

export default class DetailStoryView {
  constructor(template) {
    this.template = template;
    this.map      = null;
  }

  renderBaseTemplate() {
    document.querySelector('#main-content').innerHTML = `
    ${this.template.detailTemplate()}
    <div id="image-modal" style="
      display:none;
      position:fixed;
      top:0; left:0; right:0; bottom:0;
      background:rgba(0,0,0,0.85);
      justify-content:center;
      align-items:center;
      z-index:10000;
    ">
      <img id="modal-image" src="" alt="Full Image" style="
        max-width:90vw;
        max-height:90vh;
        box-shadow:0 0 20px rgba(255,255,255,0.5);
        border-radius:8px;
      "/>
    </div>
  `;

  document.getElementById('image-modal')
    .addEventListener('click', () => {
      document.getElementById('image-modal').style.display = 'none';
    });
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

  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    modalImg.src = story.photoUrl;
    modal.style.display = 'flex';
  });

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

   renderComments(comments, currentUser) {
    const list = document.getElementById('comment-list');
    if (!comments.length) {
      list.innerHTML = '<li>Belum ada komentar.</li>';
      return;
    }
    const sorted = [...comments].sort((a, b) => {
      const timeDiff = new Date(b.createdAt) - new Date(a.createdAt);
      if (timeDiff !== 0) return timeDiff;
      return b.cid.localeCompare(a.cid);
    });
  
    list.innerHTML = sorted.map(c => {
      const isOwner = c.author === currentUser;
      return `
        <li class="comment-item" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
          <div>  
            <strong>${c.author}</strong>
            <small style="margin-left:0.5rem;color:#666;"> ${new Date(c.createdAt).toLocaleString()}</small>
            <p style="margin:0.5rem 0 0 0;">${c.text}</p>
          </div>
          ${isOwner ? `
            <button class="btn btn-sm btn-danger delete-comment" data-cid="${c.cid}" style="margin-left:1rem;align-self:flex-start;">
              🗑️
            </button>` : ''}
        </li>
      `;
    }).join('');
  }

  clearCommentInput() {
    document.getElementById('comment-input').value = '';
  }
}
