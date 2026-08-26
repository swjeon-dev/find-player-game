# Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success)](https://swjeon-dev.github.io/find-player-game/)
![Deploy Status](https://img.shields.io/github/actions/workflow/status/swjeon-dev/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

블러 처리된 프리미어리그 선수 사진을 보고 이름을 맞히는 퀴즈입니다.  
CRA + JavaScript를 **Vite + TypeScript**로 옮기며, 외부 API 제약 속에서도 검색·퀴즈가 끊기지 않게 맞춘 프로젝트입니다.

## Demo

- Live: [swjeon-dev.github.io/find-player-game](https://swjeon-dev.github.io/find-player-game/)
- [시연 영상](https://github.com/user-attachments/assets/37036cd6-3ea5-42fa-837c-c987919557b6)

[![Quiz Demo](src/assets/imgs/auto-complete.webp)](https://github.com/user-attachments/assets/37036cd6-3ea5-42fa-837c-c987919557b6)

## 기술 포인트

- **조회 경로** — 클라이언트가 외부 API를 직접 치지 않고, Cloud Functions가 적재한 Realtime Database만 읽습니다.
- **검색 UX** — id 기반 DB·prefix 검색 제약은 스키마를 바꾸지 않고, 커버 → 리그 모달 → 팀 hover prefetch로 체감 대기를 줄였습니다. (Lighthouse 홈 LCP 24.5s → 3.2s, TBT 690ms → 0ms)
- **코드 구조** — `components/`·`hooks/` 역할별 폴더를 FSD 기준으로 나눴습니다. (`pages` → `widget` → `entities`)

## 기능

- 블러 이미지 퀴즈, prefix 자동완성
- 팀 hover로 선수 목록 확인·선택
- 오답 힌트, 정답 시 원본 이미지·입력 비활성화

## 스택

React · TypeScript · Vite · Styled Components · React Query · Recoil · Firebase (Cloud Functions + Realtime Database)

## 실행

```bash
npm install
npm run dev
```
