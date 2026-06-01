# ⚽ Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://swjeon-dev.github.io/find-player-game/) ![Deploy Status](https://img.shields.io/github/actions/workflow/status/swjeon-dev/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

**CRA(deprecated) + JavaScript** 기반 서비스를 **Vite + TypeScript**로 마이그레이션하고, 외부 API Rate Limit 등 **제약 환경을 개선**하며, **프론트엔드 관점에서 사용자 체감**을 높인 축구 선수 퀴즈입니다.

## 한 줄 소개

**Vite + TS 전환, API 제약 환경 개선, 프론트 관점 체감 UX 개선**을 다룬 축구 선수 퀴즈 웹 서비스입니다.

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

Firebase Realtime Database는 선수 정보가 `playerId` 단위로 저장되어, **contains 검색**이나 한 번의 조회로 전체 선수 목록을 가져오기 어렵습니다.

```text
/leagues/{leagueId}/teamIds, playerIds   → id 목록
/teams/{teamId}/playerIds                 → id 목록
/players/{playerId}/info                  → 선수 상세
/players                                  → 이름 prefix 검색
```

실제 조회는 보통 `id 목록 조회 → 선수 상세 조회`처럼 여러 단계를 거칩니다. 전체 선수를 먼저 가져와 클라이언트에서 필터링하면 첫 조회가 10초 이상 걸렸습니다.

그래서:

- 서버 쿼리는 **prefix(접두사) 일치 선수만 조회**
- **hover 기반 prefetch**로 다음 단계에 필요한 id·상세 데이터를 미리 준비
- 사용자는 **왼쪽 팀 메뉴 hover**로 선수 이름 확인
- 이후 입력으로 후보를 빠르게 좁히는 흐름으로 보완

즉, 데이터 구조 제약을 억지로 숨기기보다 **prefetch와 UX 설계로 체감 대기 시간을 줄이는 방향**으로 해결했습니다.

## 포트폴리오 포인트

- **Firebase(Cloud Functions + Realtime Database) 서버리스 레이어**로 외부 API 직접 호출·Rate Limit 문제 완화
- **데이터 구조 제약을 인정한 prefetch·UX 설계**로 다단계 조회의 체감 지연 완화
- **React Query 기반 캐싱 / persist**로 중복 요청 감소
- **route-level lazy loading**으로 홈 첫 진입 엔트리 청크 약 4.6 KiB(gzip) 분리
- **Debounce 기반 자동완성 최적화**로 입력 중 불필요한 연산 감소
- **상태 기반 UI 전환**으로 오답 / 정답 흐름 명확화
- **CRA → Vite + TypeScript 마이그레이션**으로 개발 생산성과 안정성 개선
- **개발 전용 Profiler를 dev/prod로 분리**해 운영 번들에서 디버깅 코드 제외

## 주요 기능

- 블러 처리된 선수 이미지를 보고 정답을 맞추는 퀴즈
- prefix 기반 자동완성 검색
- 팀 메뉴 hover를 통한 선수 이름 확인 보조
- 오답 시 힌트 제공, 정답 시 원본 이미지 및 입력 비활성화
- React Query 기반 캐싱 / prefetch
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
