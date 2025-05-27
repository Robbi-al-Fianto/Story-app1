import { urlBase64ToUint8Array, VAPID_PUBLIC_KEY } from '../utils/push.js';
import { AuthService } from '../data/api.js';

export default class AuthLoginPresenter {
  constructor(view, { authService, navigate }) {
    this.view        = view;
    this.authService = authService;
    this.navigate    = navigate;
  }

  init() {
    // Bind form login & guest login ke handler
    this.view.bindLogin(this.handleLogin.bind(this));
    this.view.bindGuestLogin(this.handleGuestLogin.bind(this));
  }

  async handleLogin(credentials) {
    try {
      // 1. Login via API
      const response = await this.authService.login(credentials);

      // 2. Simpan token & userName, hapus flag guest
      localStorage.setItem('token', response.loginResult.token);
      localStorage.setItem('userName', response.loginResult.name);
      localStorage.removeItem('isGuest');

      // 3. Request permission notifikasi jika default
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      // 4. Subscribe Push jika granted
      if (
        Notification.permission === 'granted' &&
        'serviceWorker' in navigator &&
        'PushManager' in window
      ) {
        const swReg = await navigator.serviceWorker.ready;
        const sub   = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        // 5. Kirim subscription ke server
        await this.authService.registerPush(sub);
      }

      // 6. Navigasi ke Home
      this.navigate('/', true);
     // 7. Dispatch event auth-state-changed agar menu langsung update
     document.dispatchEvent(new CustomEvent('auth-state-changed', {
       detail: { isLoggedIn: true, isGuest: false }
     }));
    } catch (error) {
      let message = error.message;
      if (message.includes('Failed to fetch')) {
        message = 'Gagal terhubung ke server';
      } else if (message.toLowerCase().includes('invalid response structure')) {
        message = 'Respons server tidak valid';
      }
      this.view.showError(message);
    }
  }

  handleGuestLogin() {
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.navigate('/');
  }
}
