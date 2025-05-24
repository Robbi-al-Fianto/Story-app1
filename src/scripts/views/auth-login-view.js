export default class AuthLoginView {
  constructor() {
    this.form = document.getElementById('loginForm');
    this.guestButton = document.querySelector('.guest-button');
  }

  getFormData() {
    return {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
  }

  bindLogin(handler) {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handler(this.getFormData());
    });
  }

  bindGuestLogin(handler) {
    this.guestButton.addEventListener('click', (e) => {
      e.preventDefault();
      handler();
    });
  }

  showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'auth-error';
    errorEl.textContent = message;
    this.form.prepend(errorEl);
    
    setTimeout(() => errorEl.remove(), 3000);
  }
}