export default class HomeView {
  constructor(template) {
    this.template = template;
  }

  renderInitialTemplate(isGuest, username) {
    return this.template.baseTemplate(isGuest, username);
  }

  displayStories(stories) {
    const container = document.querySelector('.story-grid');
    container.innerHTML = stories.map(story => 
      this.template.storyCard(story)
    ).join('');
  }

  showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }
}