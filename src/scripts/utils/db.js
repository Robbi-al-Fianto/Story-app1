// src/scripts/utils/db.js
import { openDB } from 'idb';

const DB_NAME    = 'story-app-db';
const DB_VERSION = 2;
const STORE_STORIES  = 'stories';
const STORE_DRAFTS   = 'drafts';
const STORE_COMMENTS = 'comments';

export function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_STORIES)) {
        db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_COMMENTS)) {
        const store = db.createObjectStore(STORE_COMMENTS, { keyPath: 'cid' });
        store.createIndex('by_story', 'storyId');
      }
    }
  });
}

// STORIES
export async function saveStoriesToDb(stories = []) {
  const db = await initDB();
  const tx = db.transaction(STORE_STORIES, 'readwrite');
  stories.forEach(s => tx.store.put(s));
  await tx.done;
}

export async function getStoriesFromDb() {
  const db = await initDB();
  return db.getAll(STORE_STORIES);
}

export async function deleteStoryFromDb(id) {
  const db = await initDB();
  return db.delete(STORE_STORIES, id);
}

// DRAFTS
export async function saveDraft(draft) {
  const db = await initDB();
  return db.put(STORE_DRAFTS, draft);
}

export async function getAllDrafts() {
  const db = await initDB();
  return db.getAll(STORE_DRAFTS);
}

export async function deleteDraft(id) {
  const db = await initDB();
  return db.delete(STORE_DRAFTS, id);
}

// COMMENTS
export async function saveComment(comment) {
  const db = await initDB();
  return db.put(STORE_COMMENTS, comment);
}

export async function getCommentsByStory(storyId) {
  const db = await initDB();
  return db.getAllFromIndex(STORE_COMMENTS, 'by_story', storyId);
}

export async function deleteComment(cid) {
  const db = await initDB();
  return db.delete(STORE_COMMENTS, cid);
}
