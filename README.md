# 🎵 SK-hymn (새찬송가 645곡)

**앱 주소 → https://psungkim-svg.github.io/hymn/**

폴더 하나로 동작하는 웹앱(PWA)입니다. 한 번 접속한 뒤에는 **인터넷 없이도 완전 동작**합니다.

## 📁 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 앱 본체 (화면 + 기능) |
| `hymns.json` | 찬송가 645곡 (num / title / lyrics) |
| `categories.json` | 주제 분류 — 곡당 태그 **1개 사용** |
| `ccm.json`, `en.json` | CCM / 영어 찬송 (내 모드에서만 표시) |
| `manifest.webmanifest` | 앱 정보 (이름 `SK-hymn`) — **확장자 `.txt` 붙으면 설치가 깨짐** |
| `sw.js` | 오프라인 캐싱 |
| `version.json` | 새 버전 알림용 버전 정보 |
| `icon-192.png`, `icon-512.png` | 일반 앱 아이콘 (“찬송” 글자 포함) |
| `icon-maskable-512.png` | 마스커블 아이콘 (배경 전체 노란색) |
| `apple-touch-icon.png` | iPhone 홈 화면 아이콘 |

> ℹ️ 내 모드는 **화면 분리용**입니다. 정적 웹앱이라 `ccm.json` / `en.json`은 공개 URL에 있고 기기에서 `hymn_owner` 값을 바꿀 수 있습니다.

## 🔧 v10.0 수정 사항

- 편집 연필 아이콘을 이전 이모지 크기의 약 85% 수준(21px)으로 키워 잘 보이게 개선
- 설정 창: **제목 글자는 그대로**, 설명·값·버튼·버전 정보 등 내용 글자 전체를 **18px**로 통일
- 아이콘의 “찬송” 글자를 **10% 더 확대**
- v9.10의 변경 사항 유지 (SK-hymn 이름, 넓은 편집창, 캐시 안전화 등)

## 🔄 업데이트 방법

1. 바뀐 파일을 저장소에 업로드
2. `sw.js`의 `CACHE = 'hymnal-v10-0'` 버전을 다음 번에는 `hymnal-v10-1`로 올리기
3. `index.html`의 `APP_VERSION`, `version.json`의 `version`도 같은 값으로 올리기
4. 앱을 한 번 열면 자동 갱신

> 안 바뀌는 폰이 있으면 ⚙️ 설정 맨 아래 버전 글씨를 7번 연속 탭하세요.

## 🔢 현재 버전

**SK-hymn v10.0** (빌드 2026-11-25) · 캐시 `hymnal-v10-0`
