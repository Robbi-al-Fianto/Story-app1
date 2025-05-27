import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { AuthService, StoryService } from '../data/api';
import { subscribePush, unsubscribePush, isSubscribed } from '../utils/pushManager.js';
import { clearUserLikedStories,clearStoriesCache } from '../utils/db.js';

export default class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #currentPresenter = null;
  #isInitialized = false;

  constructor({ navigationDrawer, drawerButton, content }) {
    if (!navigationDrawer || !content) {
      throw new Error("Required elements missing!");
    }

    this.#content = content;
    this.#drawerButton = drawerButton;
    
    this.#navigationDrawer = navigationDrawer;

    this.#initialize();
  }

  #initialize() {
    this.#setupCoreModules();
    this.#setupEventListeners();
    this.#setupPushToggle();
    this.#performInitialRender();
  }

  #setupCoreModules() {
    this.#setupDrawer();
    this.#checkAuthState();
    this.#updateUIState();
  }

  #setupEventListeners() {
    window.addEventListener('hashchange', () => this.#handleNavigation());
    document.addEventListener('click', this.#handleDocumentClick.bind(this));
    this.#navigationDrawer.addEventListener('click', 
      this.#handleDrawerClick.bind(this));
  }

  #performInitialRender() {
    this.#handleNavigation();
    this.#syncAuthState();
  }

  #handleNavigation = async () => {
    this.#checkAuthState();
    this.#updateUIState();
    await this.#renderCurrentPage();
  }

  #handleDocumentClick(e) {
    if (e.target.matches('#logout-btn')) this.#handleLogout();
    if (e.target.matches('#login-page-btn')) this.#handleGuestLogin();
  }

  #handleDrawerClick(e) {
    if (e.target.matches('a.drawer-link')) {
      e.preventDefault();
      const path = e.target.getAttribute('href')?.replace('#', '');
      path && (window.location.hash = path);
    }
  }

  async #handleLogout() {
    try {

      await clearStoriesCache();
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
          .then(reg => reg.pushManager.getSubscription())
          .then(sub => sub?.unsubscribe())
          .catch(console.error);
      }
      
      AuthService.unregisterPush()
        .catch(err => console.error('UnregisterPush failed:', err));

      const userName = localStorage.getItem('userName');
      localStorage.clear();
      if (userName) localStorage.setItem('userName', userName);
      this.#navigateTo('/login', true);
    } catch (error) {
      console.error('Logout error:', error);

      this.#navigateTo('/login', true);
      await clearStoriesCache();
      localStorage.clear();
      this.#navigateTo('/login', true);
    }
  }

  #handleGuestLogin() {
    localStorage.setItem('isGuest', 'true');
    this.#navigateTo('/', true);
  }

  #navigateTo(path, reload = false) {
    window.location.hash = path;
    reload && window.location.reload();
  }

  async #renderCurrentPage() {
    try {
      const route = getActiveRoute();
      const PageComponent = routes[route] || routes['/404'];
      
      await this.#cleanupPreviousPage();
      await this.#renderNewPage(PageComponent);
      
    } catch (error) {
      this.#handleRenderError(error);
    }
  }

  async #cleanupPreviousPage() {
    if (this.#currentPresenter?.cleanup) {
      await this.#currentPresenter.cleanup();
    }
    this.#currentPresenter = null;
  }

  async #renderNewPage(PageComponent) {
    const page = new PageComponent();
    const template = await page.render();

    await this.#performViewTransition(() => {
      this.#content.innerHTML = template;
    });

   this.#currentPresenter = this.#initializePresenter(page);

   if (typeof page.afterRender === 'function') {
     await page.afterRender();
   }
   
    this.#updateUIState();
  }

  #initializePresenter(page) {

    if (typeof page.initPresenter === 'function') {
      try {
        return page.initPresenter({
          authService: AuthService,
          storyService: StoryService,
          navigate: this.#navigateTo.bind(this)
        });
      } catch (error) {
        console.warn('Error initializing presenter for page:', error);
        return null;
      }
    }

    return null;
  }

  async #performViewTransition(updateCallback) {
    if (document.startViewTransition) {
      await document.startViewTransition(updateCallback).finished;
    } else {
      await this.#fallbackViewTransition(updateCallback);
    }
  }

  async #fallbackViewTransition(updateCallback) {
    const animation = this.#content.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 150, easing: 'ease-out' }
    );
    
    await animation.finished;
    updateCallback();
    
    this.#content.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 150, easing: 'ease-in' }
    );
  }

  #handleRenderError(error) {
    console.error('Render error:', error);
    this.#content.innerHTML = this.#errorTemplate(error);
  }

  #errorTemplate(error) {
    return `
      <div class="error-page">
        <h2>😞 Oops, terjadi kesalahan!</h2>
        <p>${error.message}</p>
        <a href="#/" class="home-link">Kembali ke Beranda</a>
      </div>
    `;
  }

  #updateUIState() {
    this.#updateNavbar();
    this.#updateDrawerLinks();
  }

  #updateNavbar() {
    const authSection = document.querySelector('.auth-section');
    if (!authSection) return;
    
    authSection.innerHTML = this.#navbarContent({
      isGuest: localStorage.getItem('isGuest') === 'true',
      hasToken: !!localStorage.getItem('token'),
      userName: localStorage.getItem('userName') || 'Guest'
    });
    
    const pushBtn = document.getElementById('push-toggle-btn');
    if (pushBtn) {
      pushBtn.style.display = localStorage.getItem('token') ? '' : 'none';
    }
  }

  #navbarContent({ isGuest, hasToken, userName }) {
    if (hasToken) return this.#authenticatedNavbar(userName);
    if (isGuest) return this.#guestNavbar();
    return this.#defaultNavbar();
  }

  #authenticatedNavbar(userName) {
    return `
      <span class="username">${userName}</span>
      <button id="logout-btn" class="nav-button">
        Logout <i class="fas fa-sign-out-alt"></i>
      </button>
    `;
  }

  #guestNavbar() {
    return `
      <a href="#/login" class="nav-link">
        Login <i class="fas fa-sign-in-alt"></i>
      </a>
    `;
  }

  #defaultNavbar() {
    return `
      <a href="#/login" class="nav-link">
        Login <i class="fas fa-sign-in-alt"></i>
      </a>
      <a href="#/register" class="nav-link register-btn">
        Register <i class="fas fa-user-plus"></i>
      </a>
    `;
  }

  #setupPushToggle() {
    const btn = document.getElementById('push-toggle-btn');
    if (!btn) return;
    
    const updateLabel = () => {
      btn.textContent = isSubscribed() ? 'Unsubscribe 🔕' : 'Subscribe 🔔';
    };
    updateLabel();

    btn.addEventListener('click', async () => {
      try {
        btn.disabled = true;
        if (isSubscribed()) {
          await unsubscribePush();
        } else {
          await subscribePush();
        }
        updateLabel();
      } catch (err) {
        console.error('Push toggle failed:', err);
        alert('Gagal mengubah notifikasi: ' + err.message);
      } finally {
        btn.disabled = false;
      }
    });
  }

  #updateDrawerLinks() {
    const loginItem = this.#navigationDrawer.querySelector('a[href="#/login"]')?.parentElement;
    const likedItem = this.#navigationDrawer.querySelector('a[href="#/liked"]')?.parentElement;
    
    const hasToken = !!localStorage.getItem('token');
    
    // Hide/show login menu item
    loginItem?.classList.toggle('hidden', hasToken);
    
    // Hide/show liked menu item - only show if user has token (not guest)
    if (likedItem) {
      likedItem.style.display = hasToken ? '' : 'none';
    }
  }

  // Auth Management
  #checkAuthState() {
    const currentPath = window.location.hash.replace('#', '') || '/';
    const protectedRoutes = ['/', '/add'];
    const authRoutes = ['/login', '/register'];
    const loginRequiredRoutes = ['/liked']; // Routes that require actual login (not guest)
    
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const hasToken = !!localStorage.getItem('token');

    // Check if user tries to access liked page without being logged in
    if (loginRequiredRoutes.includes(currentPath) && !hasToken) {
      alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
      this.#navigateTo('/login');
      return;
    }

    // Regular protected routes (can be accessed by guest or logged in user)
    if (protectedRoutes.includes(currentPath) && !hasToken && !isGuest) {
      this.#navigateTo('/login');
      return;
    }

    // Redirect logged in users away from auth pages
    if (authRoutes.includes(currentPath) && hasToken) {
      this.#navigateTo('/');
      return;
    }
  }

  #syncAuthState() {
    const authEvent = new CustomEvent('auth-state-changed', {
      detail: {
        isLoggedIn: !!localStorage.getItem('token'),
        isGuest: localStorage.getItem('isGuest') === 'true'
      }
    });
    document.dispatchEvent(authEvent);
  }

  // Drawer Management
  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('navigation-drawer--open');
      this.#content.classList.toggle('main-content--drawer-open');
    });

    document.addEventListener('click', (e) => {
      if (!this.#navigationDrawer.contains(e.target) && 
          !this.#drawerButton.contains(e.target)) {
        this.#navigationDrawer.classList.remove('navigation-drawer--open');
        this.#content.classList.remove('main-content--drawer-open');
      }
    });
  }
}