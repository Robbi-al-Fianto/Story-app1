export default class AuthRegisterPresenter {
  /**
   * @param {AuthRegisterView} view
   * @param {{ authService: any, navigate: (path:string)=>void }} deps
   */
  constructor(view, { authService, navigate }) {
    this.view        = view;
    this.authService = authService;
    this.navigate    = navigate;
  }

  init() {
    this.view.bindRegister(this.handleRegister.bind(this));
  }

  async handleRegister({ name, email, password }) {
    try {

      await this.authService.register({ name, email, password });

      const loginRes = await this.authService.login({ email, password });

      localStorage.setItem('token', loginRes.loginResult.token);
      localStorage.setItem('userName', loginRes.loginResult.name);

      this.navigate('/');
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
