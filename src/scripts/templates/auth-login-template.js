export default class AuthLoginTemplate {
  render() {
    return `
      <section class="auth-container">
        <div>
          <h2 class="auth-title">Welcome to Story App</h2>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="contoh@email.com"
                required
              >
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password"
                placeholder="Masukkan password"
                required
              >
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign In</button>
          </form>
          <div class="auth-links">
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
            <button class="btn btn-secondary w-100 guest-button">Lanjut sebagai Guest</button>
          </div>
        </div>
      </section>
    `;
  }
}
