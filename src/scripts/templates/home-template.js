// src/scripts/templates/home-template.js
export default class HomeTemplate {
  baseTemplate(isGuest, username) {
    return `
      <section class="container">
        <header class="home-header" style="display:flex; justify-content:space-between; align-items:center;">
          <h1 class="page-title" style="margin:0;">Welcome, ${username}</h1>
          <!-- Tombol Tambah Story untuk semua, guest atau login -->
          <button id="add-btn" class="btn btn-primary">
            Tambah Story
          </button>
        </header>
        ${
          isGuest
          ? this._guestWarning()
          : `
            <div id="map" class="map-container" style="height:400px; margin:1rem 0;"></div>
            <div class="story-grid"></div>
            <div id="loading" class="loading-indicator" style="display:none; text-align:center; margin-top:1rem;">
              <p>Loading…</p>
            </div>
          `
        }
      </section>
    `;
  }

  storyCard(story) {
       return `
         <a href="#/stories/${story.id}" class="story-link">
           <article class="story-card">
             <img src="${story.photoUrl}" alt="${story.name}" class="story-image">
             <div class="story-content">
               <h3 class="story-title">${story.name}</h3>
               <p class="story-description">${story.description}</p>
               <time class="story-date">
                 ${new Date(story.createdAt).toLocaleDateString()}
               </time>
             </div>
           </article>
         </a>
       `;
  }

  _guestWarning() {
    return `
      <div class="guest-warning">
        <p>✨ Anda masuk sebagai Guest. Anda hanya bisa menambahkan cerita.</p>
        <a href="#/login" class="btn btn-secondary">Login untuk lihat cerita</a>
      </div>
    `;
  }

  errorTemplate(message) {
    return `
      <div class="error">
        <h2>Error!</h2>
        <p>${message}</p>
      </div>
    `;
  }
}
