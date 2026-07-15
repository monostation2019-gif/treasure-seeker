/*
 * Treasure Seeker Service Worker
 * -----------------------------------------------------------
 * 設計方針（「まちみっけ」での反省を反映）:
 *  - 自動的な skipWaiting は行わない。更新は必ずユーザーが
 *    バナーの「更新する」ボタンを押した時だけ発生させる。
 *  - キャッシュ対象はコアファイルのみに限定し、Firestore/Storage
 *    への通信はキャッシュしない（ネットワーク優先＋キャッシュfallback）。
 *  - controllerchange によるリロードはメイン側で1回だけに制御する。
 */

const CACHE_NAME = 'treasure-seeker-v1'; // ファイルを更新したらこのバージョン文字列を必ず上げてください
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  // ここでは skipWaiting() を呼ばない（ユーザー操作を待つ）
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // 外部API（Firestore/Storage/地図タイル等）はキャッシュ制御に介入しない
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// メイン側の「更新する」ボタンから送られてくるメッセージでのみ更新を確定させる
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
