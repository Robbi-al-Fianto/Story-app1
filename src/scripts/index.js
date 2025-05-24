import '../styles/styles.css';
import App from './pages/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('#main-content');
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');

  if (!content || !navigationDrawer) {
    console.error('Elemen penting tidak ditemukan!');
    return;
  }

  // Inisialisasi App TANPA panggilan renderPage()
  new App({ 
    navigationDrawer, 
    drawerButton, 
    content 
  });
});