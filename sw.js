// 새찬송가 앱 서비스 워커 — 오프라인 캐싱
// ※ 앱 파일(hymns.json 등)을 수정한 뒤에는 아래 CACHE 버전을 올려주세요 (v1 → v2)
const CACHE = 'hymnal-v1';
const ASSETS = [
  './',
  './index.html',
  './hymns.json',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // hymns.json: 네트워크 우선(업데이트 즉시 반영) + 실패 시 캐시
  if (url.pathname.endsWith('hymns.json')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // 그 외: 캐시 우선 + 없으면 네트워크(캐시에 저장)
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const cp = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp));
      return r;
    }))
  );
});
