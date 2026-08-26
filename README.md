# Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success)](https://swjeon-dev.github.io/find-player-game/)

블러 처리된 프리미어리그 선수 사진을 보고 이름을 맞히는 퀴즈의 **Vite + TypeScript SPA**입니다.

## Demo

<!-- - Live: [swjeon-dev.github.io/find-player-game](https://swjeon-dev.github.io/find-player-game/) -->

- [![시연 영상](src/assets/imgs/auto-complete.webp)](https://github.com/user-attachments/assets/37036cd6-3ea5-42fa-837c-c987919557b6)

## Work

- 클라이언트는 외부 API 대신 Cloud Functions가 적재한 Realtime Database만 읽습니다.
- 홈 / 퀴즈 분리, 리그 선택·팀 hover prefetch. (Lighthouse 홈 LCP 24.5s → 3.2s)
- `components/`·`hooks/` 역할별 폴더를 FSD 기준으로 나눔.

## 코드 구조

역할별 폴더에서는 파일이 퀴즈용인지 검색용인지 폴더만으로는 안 보였습니다.  
**Feature-Sliced Design**을 참고해 도메인·화면 단위로 나눴습니다.

**이전 (역할별)**

```text
src/
  components/
  hooks/
  utils/
  constant/
  services/
```

**이후 (이 레포)**

```text
src/
  app/          providers, routes, layouts
  pages/        cover, submission, not-found
  widget/       club, cover, header
  features/     search, league-select, squad-select, submission
  entities/     club, league
  shared/       api, ui, config
functions/      Football API → RTDB 적재
```

```text
pages/ → widget/ → features/ → entities/ → shared/
```

Next App Router로 옮긴 구조는 [find-player-next README](https://github.com/swjeon-dev/find-player-next#코드-구조)를 보면 됩니다.

## 스택

React · TypeScript · Vite · Styled Components · React Query · Recoil · Firebase (Cloud Functions + Realtime Database)

## 실행

```bash
npm install
npm run dev
```
