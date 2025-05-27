// src/scripts/utils/db.js
import { openDB } from 'idb';

const DB_NAME    = 'story-app-db';
const DB_VERSION = 3; // increment version untuk perubahan schema
const STORE_STORIES     = 'stories';
const STORE_LIKED       = 'liked_stories'; // ganti dari drafts ke liked_stories
const STORE_COMMENTS    = 'comments';

export function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Stories store
      if (!db.objectStoreNames.contains(STORE_STORIES)) {
        db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
      }
      
      // Liked stories store
      if (!db.objectStoreNames.contains(STORE_LIKED)) {
        db.createObjectStore(STORE_LIKED, { keyPath: 'id' });
      }
      
      // Comments store
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

// LIKED STORIES
export async function saveLikedStory(story) {
  const db = await initDB();
  const likedStory = {
    ...story,
    likedAt: new Date().toISOString()
  };
  return db.put(STORE_LIKED, likedStory);
}

export async function getAllLikedStories() {
  const db = await initDB();
  const likedStories = await db.getAll(STORE_LIKED);
  // sort by likedAt descending (terbaru dulu)
  return likedStories.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
}

export async function removeLikedStory(storyId) {
  const db = await initDB();
  return db.delete(STORE_LIKED, storyId);
}

export async function isStoryLiked(storyId) {
  const db = await initDB();
  const story = await db.get(STORE_LIKED, storyId);
  return !!story;
}

export async function getLikedStory(storyId) {
  const db = await initDB();
  return db.get(STORE_LIKED, storyId);
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

// // DEPRECATED FUNCTIONS (untuk backward compatibility)
// // Fungsi-fungsi draft lama, redirect ke liked stories untuk sementara
// export async function saveDraft(draft) {
//   console.warn('saveDraft is deprecated, use saveLikedStory instead');
//   return saveLikedStory(draft);
// }

// export async function getAllDrafts() {
//   console.warn('getAllDrafts is deprecated, use getAllLikedStories instead');
//   return getAllLikedStories();
// }

// export async function deleteDraft(id) {
//   console.warn('deleteDraft is deprecated, use removeLikedStory instead');
//   return removeLikedStory(id);
// }