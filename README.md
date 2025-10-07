# CatChess

_A real-time, browser-based 3D auto battler starring tactical cats._

- [English](#english)
- [한국어](#한국어)

## English

### Overview
CatChess is a solo-built real-time multiplayer auto battler that runs entirely in the browser. A Node.js/Express backend drives matchmaking, battle simulation, and persistence, while a Three.js front-end renders the 3D board, cat models, and combat effects. The project demonstrates how to combine WebSockets, WebGL, and MongoDB to deliver a smooth head-to-head strategy experience.

### Live Demo & Media
- Play the latest build: [Cat Chess home](http://catchess.ap-northeast-2.elasticbeanstalk.com/)
- Watch gameplay: [0.2.9 demo video](https://www.youtube.com/watch?v=07bcqwNsibg&t=314s)
- View UI/UX mockups: [Figma board](https://www.figma.com/file/UTLu1K2qiGxK4XhZFt7q1h/catChess?type=design&node-id=0%3A1&mode=design&t=4keMP4w5z6JixYat-1)
- Explore gameplay flow: [Logic diagram](https://drive.google.com/file/d/1AHRsH_nBJkpwJ-txst1yUMQeNCm4xSDl/view?usp=drive_link)

### Highlights
- `Real-time PvP`: `server/modules/socket.js` coordinates bidirectional WebSocket traffic so two players stay in sync across matchmaking, preparation, battle, and results phases.
- `3D Arena Rendering`: `client/public/javascripts/modules/3D/Painter.js` builds the scene with Three.js, OutlineEffect, GLTF models, and dynamic lighting for a readable tactical board.
- `Roster & Skills`: Unit stats, abilities, and synergies live in `server/modules/unit` and `server/modules/constants`, enabling deterministic combat inside `Battle.js`.
- `Account & Progression`: Google OAuth in `server/routes/auth.js` issues signed cookies, while `server/db/schema/User.js` tracks wins, losses, and presence in MongoDB.
- `Localization Ready`: `server/app.js` inspects `Accept-Language`, sets a `lang` cookie, and renders Pug templates with the appropriate copy.
- `Player Insights`: Browser sessions are logged through `client/public/javascripts/main.js` and stored via `server/routes/user.js` + `server/db/schema/Device.js` for QA and balancing.

### Tech Stack
- **Server**: Node.js, Express, ws, dotenv, cookie-parser, body-parser
- **Client**: Three.js, GLTF assets, custom UI logic in vanilla JS, Pug templates
- **Data**: MongoDB with Mongoose models for users and devices
- **Tooling**: Nodemon environment scripts, ESLint-ready structure, asset pipeline in `client/public`

### Architecture at a Glance
```
Browser (UI.js, Socket.js, Painter.js)
    ↕  HTTPS + WebSocket (ws)
Express app (server/app.js)
    ↕  Game loop (Game.js, Battle.js, BattleField.js)
MongoDB (User, Device models)
```

The game server keeps the authoritative state: `Game.js` advances phases, `Battle.js` resolves ticks, and `Player.js` tracks health, gold, and inventory. The client focuses on rendering, input, and localized UI.

### Project Layout
```
CatChess/
├─ client/
│  ├─ public/            # Three.js assets, audio, styles, front-end modules
│  └─ views/page.pug     # Single-page entry rendered by Express
├─ server/
│  ├─ app.js             # Express setup, middleware, language detection
│  ├─ bin/www            # Bootstraps HTTP + WebSocket servers
│  ├─ modules/           # Game, battle, unit, and socket orchestration
│  ├─ routes/            # Auth, data, and user analytics endpoints
│  └─ db/                # Mongo connection and schema definitions
└─ package.json          # npm scripts (dev/start/test) and dependencies
```

### Getting Started
1. Install Node.js 18+ and ensure access to a MongoDB instance (Atlas or local).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```ini
   DB_URI=mongodb://localhost:27017/catchess   # or your Atlas connection string
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   PORT=8080
   ```
4. Launch the development server:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:8080/?lang=en` (or `lang=ko`) to pick a language explicitly. Development mode (`NODE_ENV=development`) boosts starting gold and HP for faster iteration (`Player.js`).

Production runs use `npm start`, which loads `.env`, binds to `PORT`, and serves static assets from `client/public`.

### Development Notes
- Matchmaking and battle flow live in `server/modules/Game.js`; states transition through ready → battle → result → queue.
- `client/public/javascripts/modules/Socket.js` documents the WebSocket message types used to synchronize board updates, unit placements, and combat results.
- Assets (GLTF models, portraits, audio) sit under `client/public/models` and `client/public/images`; `main.js` preloads unit portraits before revealing the lobby.
- Localization is cookie-based; passing `?lang=ko` or `?lang=en` overrides the browser’s `Accept-Language`.

### Interview Talking Points
- Built an authoritative real-time game loop on top of raw WebSockets without relying on heavyweight game servers.
- Implemented a Three.js rendering pipeline with OutlineEffect, GLTF loaders, and custom cat models to maintain clarity during chaotic battles.
- Persist user progression and telemetry in MongoDB, including automatic user creation and device logging for post-match analysis.

### Roadmap
- Preload large GLTF and texture assets to tighten the first meaningful paint.
- Expand responsive layout and input affordances for mobile and tablet players.
- Add more cat skills, localized copy, and UI polish for onboarding/tutorials.

---

## 한국어

### 개요
CatChess는 브라우저에서 실행되는 실시간 멀티플레이 오토 배틀러입니다. Node.js/Express 백엔드가 매칭, 전투 시뮬레이션, 영속성을 담당하고 Three.js 기반 프런트엔드가 3D 보드와 고양이 모델, 전투 이펙트를 렌더링합니다. WebSocket, WebGL, MongoDB를 결합해 두 플레이어가 끊김 없이 전략 대결을 펼칠 수 있도록 설계했습니다.

### 라이브 빌드 & 자료
- 최신 빌드 플레이: [Cat Chess home](http://catchess.ap-northeast-2.elasticbeanstalk.com/)
- 게임 플레이 영상: [0.2.9 데모](https://www.youtube.com/watch?v=07bcqwNsibg&t=314s)
- UI/UX 기획안: [Figma 보드](https://www.figma.com/file/UTLu1K2qiGxK4XhZFt7q1h/catChess?type=design&node-id=0%3A1&mode=design&t=4keMP4w5z6JixYat-1)
- 로직 다이어그램: [Draw.io 문서](https://drive.google.com/file/d/1AHRsH_nBJkpwJ-txst1yUMQeNCm4xSDl/view?usp=drive_link)

### 주요 특징
- `실시간 PvP`: `server/modules/socket.js`가 WebSocket 통신을 관리해 준비 - 전투 - 결과 - 대기 단계를 두 플레이어가 동일하게 경험합니다.
- `3D 전장 렌더링`: `client/public/javascripts/modules/3D/Painter.js`가 Three.js, OutlineEffect, GLTF 모델을 활용해 직관적인 전장과 이펙트를 구현했습니다.
- `유닛 & 스킬`: `server/modules/unit`과 `server/modules/constants`에 고양이 유닛의 능력치, 스킬, 시너지가 정의되어 있으며 전투 로직은 `Battle.js`에서 처리합니다.
- `계정 & 전적`: `server/routes/auth.js`는 Google OAuth를 통해 토큰을 발급하고, `server/db/schema/User.js`가 승/패 기록과 접속 상태를 MongoDB에 저장합니다.
- `다국어 지원`: `server/app.js`가 브라우저의 `Accept-Language`를 확인해 `lang` 쿠키를 설정하고 Pug 템플릿을 언어별로 렌더링합니다.
- `플레이어 로그`: `client/public/javascripts/main.js`가 브라우저 정보를 수집해 `server/routes/user.js` 및 `server/db/schema/Device.js`에서 QA용 데이터를 축적합니다.

### 기술 스택
- **서버**: Node.js, Express, ws, dotenv, cookie-parser, body-parser
- **클라이언트**: Three.js, GLTF 에셋, 바닐라 JS 기반 UI, Pug 템플릿
- **데이터베이스**: MongoDB + Mongoose(User, Device 스키마)
- **툴링**: Nodemon 스크립트, dotenv 환경 설정, `client/public` 에셋 파이프라인

### 아키텍처
```
브라우저 (UI.js, Socket.js, Painter.js)
    ↕  HTTPS + WebSocket (ws)
Express 앱 (server/app.js)
    ↕  게임 루프 (Game.js, Battle.js, BattleField.js)
MongoDB (User, Device 모델)
```

서버가 모든 게임 상태를 판단하고(`Game.js`), 틱 단위 전투를 해결하며(`Battle.js`), 플레이어 리소스를 관리합니다(`Player.js`). 클라이언트는 렌더링과 입력, 다국어 UI에 집중합니다.

### 프로젝트 구조
```
CatChess/
├─ client/
│  ├─ public/            # Three.js 에셋, 오디오, 스타일, 프런트엔드 모듈
│  └─ views/page.pug     # Express가 렌더링하는 단일 페이지 엔트리
├─ server/
│  ├─ app.js             # Express 설정, 미들웨어, 언어 감지
│  ├─ bin/www            # HTTP + WebSocket 서버 부트스트랩
│  ├─ modules/           # 게임, 전투, 유닛, 소켓 로직 모음
│  ├─ routes/            # 인증, 데이터, 사용자 로그 API
│  └─ db/                # Mongo 연결 및 스키마 정의
└─ package.json          # npm 스크립트( dev / start / test )와 의존성
```

### 로컬 실행 방법
1. Node.js 18+와 MongoDB(Atlas 또는 로컬 인스턴스)를 준비합니다.
2. 의존성을 설치합니다.
   ```bash
   npm install
   ```
3. 프로젝트 루트에 `.env` 파일을 작성합니다.
   ```ini
   DB_URI=mongodb://localhost:27017/catchess   # 또는 Atlas 접속 문자열
   GOOGLE_CLIENT_ID=구글 OAuth 클라이언트 ID
   GOOGLE_CLIENT_SECRET=구글 OAuth 클라이언트 시크릿
   PORT=8080
   ```
4. 개발 서버를 실행합니다.
   ```bash
   npm run dev
   ```
5. `http://localhost:8080/?lang=ko` (또는 `lang=en`)로 접속합니다. 개발 모드(`NODE_ENV=development`)에서는 빠른 테스트를 위해 시작 골드/체력이 상승하도록 설정되어 있습니다(`Player.js` 참고).

배포 환경에서는 `npm start`가 `.env`를 불러오고 `PORT`로 바인딩한 뒤 `client/public` 정적 파일을 제공합니다.

### 개발 메모
- 매치 플로우는 `server/modules/Game.js`에서 관리하며 상태가 준비 → 전투 → 결과 → 대기로 순환합니다.
- `client/public/javascripts/modules/Socket.js`에는 보드 업데이트, 유닛 이동, 전투 결과 동기화에 사용되는 WebSocket 메시지 타입이 정리되어 있습니다.
- GLTF 모델, 초상화, 오디오 등 에셋은 `client/public/models`, `client/public/images`에 있으며, `main.js`가 유닛 이미지를 선로드합니다.
- `?lang=ko` 또는 `?lang=en` 쿼리 파라미터로 언어를 강제할 수 있으며 쿠키가 이후 요청에 반영됩니다.

### 어필 포인트
- 무거운 게임 서버 없이도 WebSocket 기반의 실시간 게임 루프를 직접 설계해 권위 서버(authoritative server)를 구현했습니다.
- Three.js OutlineEffect, GLTF 로더, 맞춤형 고양이 모델을 활용해 전투 상황에서도 직관적인 3D UI를 유지했습니다.
- 사용자 전적과 장치 로그를 MongoDB에 저장해 밸런스 검토 및 QA 데이터를 확보합니다.

### 향후 계획
- 대용량 GLTF/텍스처 선로딩으로 초기 로딩 시간을 단축합니다.
- 모바일/태블릿 대응 UI와 입력 개선을 진행합니다.
- 추가 스킬, 현지화 문구, 튜토리얼 UI를 확장합니다.

