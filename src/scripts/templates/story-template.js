export default class AddStoryTemplate {
  render() {
    return `
      <section class="container">
        <div class="story-form-card">
          <h1 class="page-title">Tambah Story Baru</h1>
          <form id="storyForm" class="story-form">
            <!-- FOTO & controls -->
            <div class="form-group">
              <label for="photo">Foto</label>
              <div class="photo-buttons">
                <button type="button" id="open-camera" class="btn btn-secondary">
                  Buka Kamera
                </button>
                <button type="button" id="close-camera" class="btn btn-secondary" hidden>
                  Tutup Kamera
                </button>
                <button type="button" id="upload-photo" class="btn btn-secondary">
                  Upload Gambar
                </button>
              </div>
              <input type="file" id="photo" hidden required />

              <!-- Preview Kamera -->
              <div class="camera-container" hidden>
                <video id="camera-preview" autoplay playsinline class="camera-preview"></video>
                <button type="button" id="capture-photo" class="capture-button">
                  Ambil Foto
                </button>
              </div>

              <!-- Preview Hasil -->
              <div class="photo-preview-container" hidden>
                <img id="photo-preview" class="photo-preview" alt="Preview Foto"/>
                <button type="button" id="remove-photo" class="remove-photo-button">×</button>
              </div>
            </div>
            <!-- DESKRIPSI -->
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" required></textarea>
            </div>
            <!-- LOKASI -->
            <div class="form-group">
              <label for="locationMap">Pilih Lokasi</label>
              <div id="locationMap" class="map-embed" style="height:300px;"></div>
              <input type="hidden" id="lat" required />
              <input type="hidden" id="lon" required />
            </div>
            <!-- SUBMIT -->
            <button type="submit" class="btn btn-primary w-100">
              Publikasikan
            </button>
              <button type="button" id="save-draft-btn">Simpan Draft</button>
          </form>
        </div>
      </section>
    `;
  }
  detailTemplate() {
    return `
      <section class="container story-detail">
        <div id="story-map" class="story-map" style="height:300px;"></div>
        <div class="story-info">
          <h2 id="story-title"></h2>
          <img id="story-image" alt="" class="story-img"/>
          <p id="story-desc"></p>
          <time id="story-date"></time>
        </div>
  
       <!-- KOMENTAR -->
       <section class="comments-section">
         <h3>Komentar</h3>
         <ul id="comment-list" class="comment-list"></ul>
         <form id="commentForm" class="comment-form">
           <input 
             type="text" 
             id="comment-input" 
             placeholder="Tulis komentar..." 
             required
           />
           <button type="submit" class="btn btn-primary">Kirim</button>
         </form>
       </section>
      </section>
    `;
  }
  
}
