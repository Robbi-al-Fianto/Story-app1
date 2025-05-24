// src/scripts/views/add-story-view.js
import MapView from './components/map-view.js';

export default class AddStoryView {
  constructor(template) {
    this.template     = template;
    this.mapView      = null;
    this.handlers     = {};
  }

  render() {
    return this.template.render();
  }

  initMap(onClick) {
    this.mapView = new MapView('locationMap', { center: [-6.1754,106.8272], zoom: 5 });
    this.mapView.onClick(onClick);
    this.mapView.init();
  }

  bindCamera({ open, close, capture, upload, remove, onFileChange }) {
    const openBtn   = document.getElementById('open-camera');
    const closeBtn  = document.getElementById('close-camera');
    const capBtn    = document.getElementById('capture-photo');
    const uploadBtn = document.getElementById('upload-photo');
    const removeBtn = document.getElementById('remove-photo');
    const fileInput = document.getElementById('photo');

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    capBtn.addEventListener('click', capture);
    uploadBtn.addEventListener('click', upload);
    removeBtn.addEventListener('click', remove);
    fileInput.addEventListener('change', onFileChange);
  }

  bindSubmit(handler) {
    document.getElementById('storyForm')
      .addEventListener('submit', handler);
  }

  showAlert(msg) {
    alert(msg);
  }

  bindSaveDraft(handler) {
    document.getElementById('save-draft-btn')
            .addEventListener('click', handler);
  }
  getDescription() {
    return document.getElementById('description').value;
  }
  getLat() {
    return document.getElementById('lat').value;
  }
  getLon() {
    return document.getElementById('lon').value;
  }
  getPhotoFile() {
    return document.getElementById('photo').files[0];
  }
}
