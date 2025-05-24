// src/scripts/utils/pushManager.js
import { urlBase64ToUint8Array, VAPID_PUBLIC_KEY } from './push.js';
import { AuthService } from '../data/api.js';

const SUB_KEY = 'push-endpoint';

export async function subscribePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push not supported');
  }
  const swReg = await navigator.serviceWorker.ready;
  const subscription = await swReg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
  // kirim ke backend
  await AuthService.registerPush(subscription);
  // simpan endpoint
  localStorage.setItem(SUB_KEY, subscription.endpoint);
  return subscription.endpoint;
}

export async function unsubscribePush() {
  if (!('serviceWorker' in navigator)) return;
  const swReg = await navigator.serviceWorker.ready;
  const sub = await swReg.pushManager.getSubscription();
  if (sub) {
    // hapus di SW
    await sub.unsubscribe();
    // hapus di backend
    await AuthService.unregisterPush();
  }
  localStorage.removeItem(SUB_KEY);
}

export function isSubscribed() {
  return !!localStorage.getItem(SUB_KEY);
}
