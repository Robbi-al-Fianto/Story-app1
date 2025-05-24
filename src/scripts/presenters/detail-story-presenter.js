// src/scripts/presenters/detail-story-presenter.js
import { getCommentsByStory, saveComment, deleteComment } from '../utils/db.js'; 
import { v4 as uuidv4 } from 'uuid';

export default class DetailStoryPresenter {
  constructor(view, { storyService, navigate }) {
    this.view         = view;
    this.storyService = storyService;
    this.navigate     = navigate;
  }

  async initialize(storyId) {
    this.view.showLoading();
    try {
      this.view.renderBaseTemplate();
      const story = await this.storyService.getStoryById(storyId);
      this.view.renderStory(story);
      this.view.renderMap(story.lat, story.lon);

      // Bind komentar
      this.view.bindCommentSubmit(text => this.handleNewComment(storyId, text));
      this.view.bindCommentDelete(cid => this.handleDeleteComment(storyId, cid));

      // Render komentar awal
      const comments = await getCommentsByStory(storyId);
      this.view.renderComments(comments);

    } catch (err) {
      this.view.showError(err.message);
    } finally {
      this.view.hideLoading();
    }
  }

  async handleNewComment(storyId, text) {
    if (!text) return;
    const comment = {
      cid:       uuidv4(),
      storyId,
      author:    localStorage.getItem('userName') || 'Guest',
      text,
      createdAt: new Date().toISOString(),
    };
    await saveComment(comment);
    const all = await getCommentsByStory(storyId);
    this.view.renderComments(all);
    this.view.clearCommentInput();
  }

  async handleDeleteComment(storyId, cid) {
    // <— sekarang deleteComment sudah terimport
    await deleteComment(cid);

    // reload daftar komentar
    const all = await getCommentsByStory(storyId);
    this.view.renderComments(all);
  }
}
