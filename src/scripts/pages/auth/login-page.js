import AuthLoginView from '../../views/auth-login-view';
import AuthLoginPresenter from '../../presenters/auth-login-presenter';
import AuthLoginTemplate from '../../templates/auth-login-template';
import { AuthService } from '../../data/api'; 


export default class LoginPage {
  constructor() {
    this.template = new AuthLoginTemplate();
    this.view = new AuthLoginView();
    this.presenter = null;
  }

  async render() {
    return this.template.render();
  }

  initPresenter(dependencies) {
    return new AuthLoginPresenter(this.view, { authService: AuthService, navigate: dependencies.navigate });
  }

  async afterRender() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const credentials = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
          };
          const response = await AuthService.login(credentials);
          localStorage.setItem('token', response.loginResult.token);
          localStorage.setItem('userName', response.loginResult.name);
          window.location.hash = '#/';
        } catch (error) {
          alert(error.message);
        }
      });
    }

    const guestButton = document.querySelector('.guest-button');
    if (guestButton) {
      guestButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('userName', 'Guest');
        localStorage.removeItem('token');
        window.location.hash = '#/';
      });
    }
  }
}