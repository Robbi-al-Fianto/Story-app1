// src/scripts/views/components/map-view.js
import L from 'leaflet';

export default class MapView {
  constructor(containerId, opts = {}) {
    this.containerId = containerId;
    this.center      = opts.center || [-6.2000, 106.8166];
    this.zoom        = opts.zoom    || 5;
    this.map         = null;
    this.markerLayer = null;
    this._clickCb    = null;
  }

  init() {
    // 1) Ambil elemen container
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Map container #${this.containerId} tidak ditemukan`);
      return;
    }

    // 2) Kosongkan HTML container supaya instance lama hilang
    container.innerHTML = '';

    // 3) Jika pernah ada map, destroy juga
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    // 4) Buat ulang peta
    this.map = L.map(this.containerId).setView(this.center, this.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // 5) Setup marker layer
    this.markerLayer = L.layerGroup().addTo(this.map);

    // 6) Jika ada callback klik, pasang handler
    if (this._clickCb) {
      this.map.on('click', e => this._onMapClick(e.latlng));
    }
  }

  onClick(cb) {
    this._clickCb = cb;
  }

  _onMapClick(latlng) {
    this.markerLayer.clearLayers();
    L.marker(latlng).addTo(this.markerLayer);
    this._clickCb?.(latlng);
  }

  addMarkers(items) {
    if (!this.map) return;
    this.markerLayer.clearLayers();
    items.forEach(i => {
      if (i.lat != null && i.lon != null) {
        const m = L.marker([i.lat, i.lon]);
        if (i.popupHtml) m.bindPopup(i.popupHtml);
        m.addTo(this.markerLayer);
      }
    });
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
