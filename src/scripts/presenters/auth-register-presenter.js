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
      // 1. Registrasi
      await this.authService.register({ name, email, password });
      // 2. Auto-login
      const loginRes = await this.authService.login({ email, password });
      // 3. Simpan token & nama
      localStorage.setItem('token', loginRes.loginResult.token);
      localStorage.setItem('userName', loginRes.loginResult.name);
      // navigasi ke Home
      this.navigate('/');
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
