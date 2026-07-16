/* =====================================================================
   トレジャーシーカー伊勢 | Service Worker
   -----------------------------------------------------------------
   方針:
   - HTML（ページ本体）は常にネットワークを優先して取得する。
     キャッシュに頼らないことで「更新したのに反映されない」事故を防ぐ。
     オフライン時のみ、直近に取得できたキャッシュへフォールバックする。
   - 画像やCDNの静的アセット（Leaflet / Firebase SDK / フォント等）は
     キャッシュ優先＋裏側で最新を取りにいく（stale-while-revalidate）。
   - 新しいバージョンが見つかっても自動でリロードはしない。
     ページ側から SKIP_WAITING メッセージが来た時だけ切り替える。
     （過去に自動リロードが無限ループする不具合が起きたための安全策）
   ===================================================================== */

const CACHE_VERSION = 'v1'; // ← 静的アセットの内容を大きく変えた時だけ数字を上げてください
const CACHE_NAME = `treasure-seeker-ise-${CACHE_VERSION}`;

// 起動時に先読みしておきたい最低限の静的アセット。
// ここに無いものも、初回アクセス時に自動でキャッシュされていきます。
const PRECACHE_URLS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 1つでも取得に失敗すると install 全体が失敗扱いになるため、
      // allSettled で個別に許容する
      return Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
    })
  );
  // ここでは skipWaiting() を呼ばない。ユーザーの明示操作を待つ。
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ページ側から「今すぐ新しいバージョンに切り替えて」と言われた時だけ切り替える
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // 書き込み系リクエストは素通し

  const acceptsHtml = req.headers.get('accept') && req.headers.get('accept').includes('text/html');
  const isHtmlRequest = req.mode === 'navigate' || acceptsHtml;

  if (isHtmlRequest) {
    // ページ本体はネットワーク優先。取得できたら都度キャッシュを更新し、
    // オフライン等で失敗した時だけ最後に取得できたキャッシュを返す。
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 画像・CSS・JS・フォント等はキャッシュ優先＋裏側で更新（stale-while-revalidate）
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
