import HomePage from '../pages/home/home-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import LoginPage from '../pages/auth/login-page';
import RegisterPage from '../pages/auth/register-page';
import NotFoundPage from '../pages/404/404-page.js'; 
import StoryPage   from '../pages/story/story-page.js';
import LikedPage from '../pages/liked/liked-page.js';

const routes = {
  '/': HomePage,     
  '/add': AddStoryPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/stories/:id': StoryPage,
  '/liked': LikedPage,
  '/404': NotFoundPage,
};

export default routes;
