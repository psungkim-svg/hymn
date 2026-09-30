// 새찬송가 앱 서비스 워커 — 오프라인 캐싱
// html/데이터는 '네트워크 우선': 파일을 올리면 다음 실행 때 자동으로 새 버전이 반영됩니다.
// (인터넷이 없으면 저장해 둔 복사본으로 보여 줍니다)
//
// v4 변경점
//  1) addAll → 개별 add + allSettled : 파일 하나가 404여도 나머지는 정상 캐시됨
//  2) 페이지 요청 판별을 경로 정규식 → request.mode === 'navigate' 로 변경
//     (https://계정.github.io/저장소/ 처럼 /index.html 이 안 붙는 주소에서도 새 버전이 내려옴)
//  3) 오프라인 시 네비게이션 요청은 index.html 캐시로 폴백
const CACHE = 'hymnal-v7';
const ASSETS = [
  './',
  './index.html',
  './hymns.json',
  './ccm.json',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // 한 파일이 실패해도 설치 전체가 깨지지 않도록 개별 처리
      .then(c => Promise.allSettled(ASSETS.map(u => c.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
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
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const isPage = req.mode === 'navigate';                 // 주소창으로 앱을 여는 모든 경우
  const isData = url.pathname.endsWith('hymns.json') ||
                 url.pathname.endsWith('ccm.json') ||
                 url.pathname.endsWith('index.html') ||
                 url.pathname.endsWith('manifest.webmanifest');

  // 페이지 / 데이터: 네트워크 우선 → 실패 시(오프라인) 캐시 사용
  if (isPage || isData) {
    e.respondWith(
      fetch(req)
        .then(r => {
          if (r && r.ok) {
            const cp = r.clone();
            caches.open(CACHE).then(c => c.put(req, cp));
          }
          return r;
        })
        .catch(() =>
          caches.match(req).then(hit =>
            hit ||
            // 오프라인인데 이 주소로는 캐시가 없을 때 → 앱 본체로 폴백
            (isPage ? caches.match('./index.html').then(x => x || caches.match('./')) : undefined)
          )
        )
    );
    return;
  }

  // 그 외(아이콘 등 잘 안 바뀌는 파일): 캐시 우선
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r && r.ok) {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(req, cp));
      }
      return r;
    }))
  );
});
