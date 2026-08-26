// 새찬송가 앱 서비스 워커 — 오프라인 캐싱
// html/데이터는 '네트워크 우선': 파일을 올리면 다음 실행 때 자동으로 새 버전이 반영됩니다.
// (인터넷이 없으면 저장해 둔 복사본으로 보여 줍니다)
const CACHE = 'hymnal-v2';
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

  // index.html / hymns.json: 네트워크 우선 → 실패 시(오프라인) 캐시 사용
  if (url.pathname.endsWith('hymns.json') || /\/index\.html$|\/hymn\/?$/.test(url.pathname)) {
    e.respondWith(
      fetch(e.request).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // 그 외(아이콘 등 잘 안 바뀌는 파일): 캐시 우선
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const cp = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp));
      return r;
    }))
  );
});
