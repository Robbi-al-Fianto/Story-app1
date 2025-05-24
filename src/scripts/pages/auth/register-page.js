import AuthRegisterTemplate    from '../../templates/auth-register-template';
import AuthRegisterView        from '../../views/auth-register-view';
import AuthRegisterPresenter   from '../../presenters/auth-register-presenter';

export default class RegisterPage {
  constructor() {
    this.template = new AuthRegisterTemplate();
    this.view     = new AuthRegisterView(this.template);
    this.presenter= null;
  }

  /**
   * Dipanggil App.js untuk inject dependencies
   */
  initPresenter({ authService, navigate }) {
    this.presenter = new AuthRegisterPresenter(this.view, { authService, navigate });
    return this.presenter;
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.presenter.init();
  }
}
