import '../styles/styles.css';
import App from './pages/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('#main-content');
  const drawerButton = document.querySelector('#drawer-button');
  const navigationDrawer = document.querySelector('#navigation-drawer');

    // Skip to content
    const skipLink = document.querySelector('.skip-link');
    if (skipLink && content) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        content.focus();
      });
    }
  
  if (!content || !navigationDrawer) {
    console.error('Elemen penting tidak ditemukan!');
    return;
  }


  new App({ 
    navigationDrawer, 
    drawerButton, 
    content 
  });
});