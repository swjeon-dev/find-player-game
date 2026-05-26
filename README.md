# ⚽ Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://swjeon-dev.github.io/find-player-game/) ![Deploy Status](https://img.shields.io/github/actions/workflow/status/swjeon-dev/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

외부 API Rate Limit 문제를 해결하기 위해 **Firebase 기반 서버리스 구조**로 개선한 축구 선수 퀴즈 서비스입니다.  
블러 처리된 프리미어리그 선수 이미지를 보고 정답을 맞추는 과정에서 **자동완성, 힌트, 상태 기반 UI, 캐싱된 데이터 흐름**을 제공합니다.

## 한 줄 소개

**외부 API 직접 의존 구조를 서버리스 구조로 전환하고, 검색 제약을 UX 설계로 풀어낸 축구 선수 퀴즈 웹 서비스**입니다.

## Demo

- [Live Demo](https://swjeon-dev.github.io/find-player-game/)
- [시연 영상 보기](https://github.com/user-attachments/assets/37036cd6-3ea5-42fa-837c-c987919557b6)

[![Quiz Demo Thumbnail](src/assets/imgs/auto-complete.webp)](https://github.com/user-attachments/assets/37036cd6-3ea5-42fa-837c-c987919557b6)

## 핵심 문제와 해결

### 1. 외부 API Rate Limit

직접 호출 구조 대신 Firebase Realtime Database + Cloud Functions 구조로 바꿔,
클라이언트의 외부 API 의존을 줄이고 서비스 안정성을 높였습니다.

```text
Client → Firebase Realtime Database
        ↑
Cloud Functions
        ↑
External API
```

### 2. 검색 데이터 구조 제약

입력값을 포함하는 선수 검색이 어려워, 전체 선수 조회 후 클라이언트 필터링을 시도했지만 첫 조회가 10초 이상 걸렸습니다.

그래서:

- 서버 쿼리는 **prefix(접두사) 일치 선수만 조회**
- 사용자는 **왼쪽 팀 메뉴 hover**로 선수 이름 확인
- 이후 입력으로 후보를 빠르게 좁히는 흐름으로 보완

즉, 데이터 구조 제약을 억지로 숨기기보다 **사용 흐름을 더 자연스럽게 만드는 방향**으로 해결했습니다.

## 포트폴리오 포인트

- **서버리스 아키텍처 전환**으로 외부 API 직접 의존 제거
- **React Query 기반 캐싱 / preload**로 초기 진입 경험 개선
- **Debounce 기반 자동완성 최적화**로 입력 중 불필요한 연산 감소
- **상태 기반 UI 전환**으로 오답 / 정답 흐름 명확화
- **CRA → Vite + TypeScript 마이그레이션**으로 개발 생산성과 안정성 개선

## 주요 기능

- 블러 처리된 선수 이미지를 보고 정답을 맞추는 퀴즈
- prefix 기반 자동완성 검색
- 팀 메뉴 hover를 통한 선수 이름 확인 보조
- 오답 시 힌트 제공, 정답 시 원본 이미지 및 입력 비활성화
- React Query 기반 캐싱 / preload
- Firebase Realtime Database / Cloud Functions 기반 서버리스 데이터 구조

## 기술 스택

- React
- TypeScript
- Vite
- Styled Components
- React Query
- Recoil
- Firebase (Realtime Database / Cloud Functions)
- GitHub Actions

## 실행 방법

```bash
npm install
npm run dev
```

## 더 보기

- 상세 설명: `docs/portfolio.md`
- 이전 상세 README 보관본: `README.archive.md`
