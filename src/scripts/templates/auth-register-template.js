export default class AuthRegisterTemplate {
  render() {
    return `
      <section class="auth-container">
        <div class="auth-card">
          <h2 class="auth-title">Daftar Akun Baru</h2>
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Nama Lengkap</label>
              <input type="text" id="name" placeholder="Masukkan nama lengkap" required />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" placeholder="contoh@email.com"
                     required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password"
                     placeholder="Minimal 8 karakter"
                     minlength="8" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">
              Daftar Sekarang
            </button>
          </form>
          <p class="auth-link">
            Sudah punya akun? <a href="#/login">Login di sini</a>
          </p>
        </div>
      </section>
    `;
  }
}
