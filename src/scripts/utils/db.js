// src/scripts/utils/db.js
import { openDB } from 'idb';

const DB_NAME    = 'story-app-db';
const DB_VERSION = 5;
const STORE_STORIES     = 'stories';
const STORE_LIKED       = 'liked_stories';
const STORE_COMMENTS    = 'comments';

export function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, tx) {
      // Stories store
      if (!db.objectStoreNames.contains(STORE_STORIES)) {
        db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
      }
      
      // Liked stories store - user-specific
      if (!db.objectStoreNames.contains(STORE_LIKED)) {
        const store = db.createObjectStore(STORE_LIKED, { keyPath: 'key' });
        store.createIndex('by_user', 'userId');
      } else if (oldVersion < 5) {
        const store = tx.objectStore(STORE_LIKED);
        if (!store.indexNames.contains('by_user')) {
          store.createIndex('by_user', 'userId');
        }
      }
      
      // Comments store
      if (!db.objectStoreNames.contains(STORE_COMMENTS)) {
        const store = db.createObjectStore(STORE_COMMENTS, { keyPath: 'cid' });
        store.createIndex('by_story', 'storyId');
      }
    }
  });
}

function getCurrentUserId() {
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('isGuest') === 'true';
  if (token) {
    return localStorage.getItem('userName') || token.substring(0, 10);
  } else if (isGuest) {
    return 'guest';
  }
  return null;
}

function createLikedKey(storyId, userId) {
  return `${userId}_${storyId}`;
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

// LIKED STORIES
export async function saveLikedStory(story) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User must be logged in to save liked stories');

  const db = await initDB();
  const likedStory = {
    key: `${userId}_${story.id}`,
    userId,
    storyId: story.id,
    ...story,
    likedAt: new Date().toISOString(),
  };
  return db.put(STORE_LIKED, likedStory);
}

export async function getAllLikedStories() {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User must be logged in to access liked stories');
  const db = await initDB();
  const allLiked = await db.getAllFromIndex(STORE_LIKED, 'by_user', userId);
  return allLiked.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt));
}

export async function removeLikedStory(storyId) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('User must be logged in to remove liked stories');
  const db = await initDB();

  const key = `${userId}_${storyId}`;
  return db.delete('liked_stories', key);
}

export async function isStoryLiked(storyId) {
  const userId = getCurrentUserId();
  if (!userId) return false;
  const db = await initDB();
  const key = createLikedKey(storyId, userId);
  const story = await db.get(STORE_LIKED, key);
  return !!story;
}

export async function clearUserLikedStories() {
  const userId = getCurrentUserId();
  if (!userId) return;
  const db = await initDB();
  const tx = db.transaction(STORE_LIKED, 'readwrite');
  const userLiked = await tx.store.index('by_user').getAll(userId);
  for (const item of userLiked) {
    await tx.store.delete(item.key);
  }
  await tx.done;
}

export async function clearStoriesCache() {
  const db = await initDB();
  const tx = db.transaction(STORE_STORIES, 'readwrite');
  await tx.store.clear();
  await tx.done;
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