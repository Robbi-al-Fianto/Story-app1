export default class AuthRegisterView {
  constructor(template) {
    this.template = template;
  }

  render() {
    return this.template.render();
  }

  /**
   * Bind event submit, kirimkan data ke handler
   * @param {(creds: {name,email,password})=>void} handler
   */
  bindRegister(handler) {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name     = document.getElementById('name').value.trim();
      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      handler({ name, email, password });
    });
  }

  showError(message) {
    alert(`Register gagal: ${message}`);
  }
}
