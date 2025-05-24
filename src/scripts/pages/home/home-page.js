import HomeTemplate  from '../../templates/home-template.js';
import HomeView      from '../../views/home-view.js';
import HomePresenter from '../../presenters/home-presenter.js';

export default class HomePage {
  constructor() {
    this.template  = new HomeTemplate();
    this.view      = new HomeView(this.template);
    this.presenter = null;
  }

  initPresenter({ storyService, navigate }) {
    this.presenter = new HomePresenter(this.view, storyService);
    // bind tombol add / guest-add
    this.view.bindAddButton(isGuest => {
      if (isGuest) navigate('/login');
      else navigate('/add');
    });
    return this.presenter;
  }

  async render() {
    const token   = localStorage.getItem('token');
    const isGuest = !token && localStorage.getItem('isGuest') === 'true';
    const username = localStorage.getItem('userName') || 'Guest';
    return this.template.baseTemplate(isGuest, username);
  }

  async afterRender() {
    await this.presenter.initialize();
  }
}
