// src/scripts/presenters/story-presenter.js
import { saveDraft } from '../utils/db.js';
import { saveComment, getCommentsByStory } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export default class AddStoryPresenter {
  constructor(view, { storyService, navigate }) {
    this.view         = view;
    this.storyService = storyService;
    this.navigate     = navigate;
    this.cameraStream = null;
  }

  init() {
    // cek hak akses
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const token   = localStorage.getItem('token');
    if (!token && !isGuest) {
      this.view.showAlert('Anda perlu login atau lanjut sebagai Guest');
      return this.navigate('/login');
    }

    // render form + map
    this.view.initMap(latlng => {
      document.getElementById('lat').value = latlng.lat;
      document.getElementById('lon').value = latlng.lng;
    });

    // bind camera actions
    this.view.bindCamera({
      open:   () => this._openCamera(),
      close:  () => this._stopCamera(),
      capture:() => this._capturePhoto(),
      upload: ()=> document.getElementById('photo').click(),
      remove: ()=> this._removePhoto(),
      onFileChange: () => this._onFileChange(),
    });

    // bind submit
    this.view.bindSubmit(e => this._handleSubmit(e));
    this.view.bindSaveDraft(() => this.handleSaveDraft());
  }

  async _openCamera() {
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      document.getElementById('camera-preview').srcObject = this.cameraStream;
      document.querySelector('.camera-container').hidden = false;
      document.getElementById('capture-photo').hidden = false;
      document.getElementById('open-camera').hidden   = true;
      document.getElementById('upload-photo').hidden   = true;
      document.getElementById('close-camera').hidden  = false;
    } catch (e) {
      this.view.showAlert('Gagal akses kamera: ' + e.message);
    }
  }

  _stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(t => t.stop());
      this.cameraStream = null;
    }
    document.querySelector('.camera-container').hidden = true;
    document.getElementById('capture-photo').hidden    = true;
    document.getElementById('close-camera').hidden     = true;
    document.getElementById('open-camera').hidden      = false;
    document.getElementById('upload-photo').hidden     = false;
  }

  _capturePhoto() {
    const video = document.getElementById('camera-preview');
    const canvas= document.createElement('canvas');
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video,0,0);
    canvas.toBlob(blob => {
      const file = new File([blob],'photo.jpg',{ type:'image/jpeg' });
      const dt   = new DataTransfer();
      dt.items.add(file);
      document.getElementById('photo').files = dt.files;
      document.getElementById('photo-preview').src = URL.createObjectURL(file);
      document.querySelector('.photo-preview-container').hidden = false;
      this._stopCamera();
    },'image/jpeg',0.9);
  }

  _removePhoto() {
    document.getElementById('photo').value = '';
    document.getElementById('photo-preview').src = '';
    document.querySelector('.photo-preview-container').hidden = true;
  }

  _onFileChange() {
    const input = document.getElementById('photo');
    if (input.files.length) {
      document.getElementById('photo-preview').src = URL.createObjectURL(input.files[0]);
      document.querySelector('.photo-preview-container').hidden = false;
      this._stopCamera();
    }
  }

  async handleSaveDraft() {
    const desc = this.view.getDescription().trim();
    const lat  = this.view.getLat();
    const lon  = this.view.getLon();
    const file = this.view.getPhotoFile();

    if (!desc || !file) {
      return this.view.showAlert('Deskripsi dan foto wajib diisi.');
    }

    const draft = {
      id: uuidv4(),
      description: desc,
      lat, lon,
      // Simpan Blob jika perlu offline image preview,
      // bisa juga hanya metadata dan ulangi capture nanti
      createdAt: new Date().toISOString(),
    };

    try {
      await saveDraft(draft);
      this.view.showAlert('Draft berhasil disimpan!');
    } catch (err) {
      this.view.showAlert('Gagal simpan draft: ' + err.message);
    }
  }  async handleSaveDraft() {
    const desc = this.view.getDescription().trim();
    const lat  = this.view.getLat();
    const lon  = this.view.getLon();
    const file = this.view.getPhotoFile();

    if (!desc || !file) {
      return this.view.showAlert('Deskripsi dan foto wajib diisi.');
    }

    const draft = {
      id: uuidv4(),
      description: desc,
      lat, lon,
      // Simpan Blob jika perlu offline image preview,
      // bisa juga hanya metadata dan ulangi capture nanti
      createdAt: new Date().toISOString(),
    };

    try {
      await saveDraft(draft);
      this.view.showAlert('Draft berhasil disimpan!');
    } catch (err) {
      this.view.showAlert('Gagal simpan draft: ' + err.message);
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const file = document.getElementById('photo').files[0];
    const lat  = document.getElementById('lat').value;
    const lon  = document.getElementById('lon').value;
    const desc = document.getElementById('description').value.trim();

    if (!file || file.size > 1_000_000) {
      return this.view.showAlert('Gambar wajib & maksimal 1MB');
    }
    if (!lat || !lon) {
      return this.view.showAlert('Silakan pilih lokasi');
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', desc);
    formData.append('lat', lat);
    formData.append('lon', lon);

    try {
      if (localStorage.getItem('token')) {
        await this.storyService.addStory(formData);
      } else {
        await this.storyService.addStoryGuest(formData);
      }
      this.navigate('/');
    } catch (err) {
      this.view.showAlert('Gagal kirim: ' + err.message);
    }
  }

  async cleanup() {
  this.view.mapView?.destroy();
  if (this.cameraStream) {
    this.cameraStream.getTracks().forEach(t => t.stop());
  }
}

}
