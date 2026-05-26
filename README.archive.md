# ⚽ Find Football Player Quiz

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://swjeon-dev.github.io/find-player-game/) ![Deploy Status](https://img.shields.io/github/actions/workflow/status/swjeon-dev/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

외부 API Rate Limit 문제를 해결하기 위해 서버리스 구조로 개선한 퀴즈형 웹 서비스입니다.  
블러 처리된 프리미어리그 선수 이미지를 보고 정답을 맞추는 과정에서 자동완성, 힌트, 상태 기반 UI를 제공합니다.

## 프로젝트 한 줄 소개

**외부 API 직접 의존 구조를 Firebase 기반 서버리스 구조로 전환하고, 자동완성과 힌트 중심 UX를 설계한 축구 선수 퀴즈 웹 서비스**입니다.

## 왜 이 프로젝트를 만들었는가

이 프로젝트는 단순히 퀴즈 게임을 구현하는 것보다,  
**외부 API 제약이 있는 환경에서 안정적인 서비스 구조와 자연스러운 입력 경험을 어떻게 만들지**를 검증하는 데 목적이 있었습니다.

- 외부 API Rate Limit 때문에 직접 호출 구조로는 안정적인 서비스 제공이 어려웠습니다.
- 자동완성 입력 과정에서 불필요한 요청과 렌더링이 반복되는 문제가 있었습니다.
- 초기 로딩 지연과 상태 변화가 사용자 경험에 직접적인 영향을 주는 구조였습니다.

즉, 이 프로젝트는 퀴즈 로직 구현과 함께 **서버리스 아키텍처 전환, 캐싱 전략, 입력 성능 최적화, 데이터 구조 제약을 고려한 검색 UX 설계**를 함께 다뤄본 작업입니다.

## Screenshots

아래 화면은 실제 사용자 흐름을 기준으로 정리했습니다.

### Loading

초기 데이터 준비 중에는 Skeleton UI로 로딩 공백을 줄였습니다.

![loading](src/assets/imgs/loading.webp)

### Entry

블러 처리된 선수 이미지를 보고 이름을 입력하는 메인 화면입니다.

![main-interface](src/assets/imgs/main-interface.webp)

### Auto Complete

자동완성으로 입력 부담을 줄이고, 빠르게 정답 후보를 찾을 수 있게 했습니다.

![auto-complete](src/assets/imgs/auto-complete.webp)

### Hint

오답 시 단계적으로 힌트를 제공해 게임 흐름을 이어가도록 구성했습니다.

![hints](src/assets/imgs/hints.webp)

### Result

정답을 맞추면 원본 이미지를 보여주고 입력을 비활성화합니다.

![result](src/assets/imgs/result.webp)

## 주요 기능

- 블러 처리된 프리미어리그 선수 이미지를 보고 정답을 맞추는 퀴즈
- 자동완성 기반 선수 이름 검색
- prefix(접두사) 기반 선수 검색 + 팀 메뉴 hover를 활용한 입력 보조
- 팀 이미지 hover를 통한 입력 보조
- 오답 시 힌트 제공, 정답 시 원본 이미지 및 결과 상태 전환
- React Query 기반 데이터 캐싱 및 preload
- Firebase Realtime Database / Cloud Functions 기반 서버리스 데이터 구조

## 직접 구현한 포인트

### 1. 서버리스 아키텍처로 외부 API 의존 제거

외부 API를 클라이언트가 직접 호출하지 않고, Cloud Functions가 데이터를 수집한 뒤 Firebase Realtime Database에 저장하도록 구조를 바꿨습니다.

```text
[기존]
Client → External API

[개선]
Client → Firebase Realtime Database
        ↑
Cloud Functions (데이터 수집 및 동기화)
        ↑
External API
```

이 전환으로 API Rate Limit 문제를 줄이고, 더 안정적인 데이터 제공 흐름을 만들었습니다.

### 2. React Query 기반 데이터 관리

서버 상태를 캐싱해 중복 요청을 줄이고, 초기 데이터 preload로 첫 진입 경험을 개선했습니다.

- 데이터 재요청 빈도 감소
- 초기 화면 응답성 개선
- 비동기 상태 흐름 단순화

### 3. Debounce 기반 자동완성 최적화

입력마다 상태가 즉시 반응하면 불필요한 연산과 리렌더링이 늘어나기 때문에, Debounce 로직을 커스텀 훅으로 분리해 검색 흐름을 안정화했습니다.

- 입력 빈도에 맞춘 업데이트 지연
- 동일 값 재반영 방지
- 자동완성 입력 시 체감 성능 개선

### 4. 서버 데이터 구조 제약을 고려한 검색 UX 설계

이 프로젝트에서 검색은 단순한 contains 검색으로 풀기 어려웠습니다.  
서버 데이터 구조상 **입력 값을 포함하는 선수 전체를 유연하게 검색하기 어려운 제약**이 있었기 때문입니다.

초기에는 전체 선수 데이터를 먼저 조회한 뒤, 클라이언트에서 입력값으로 필터링하는 방식을 사용했습니다.  
하지만 전체 조회에 **10초 이상** 걸렸고, 캐싱이나 프리페칭을 적용하더라도 첫 진입 시 체감 지연이 컸습니다.

그래서 검색 전략을 다음과 같이 바꿨습니다.

- 서버 쿼리는 **prefix(접두사) 일치 선수만 조회**
- 사용자는 **왼쪽 팀 메뉴 hover**로 선수 이름을 확인 가능
- 이후 검색 입력으로 정답 후보를 더 빠르게 좁히는 흐름으로 UX 보완

즉, 데이터 구조의 한계를 인지하고,  
검색 정확도만 높이기보다 **실제 사용 흐름에서 입력 부담을 줄이는 방향**으로 설계했습니다.

### 5. 상태 기반 UI 전환 설계

퀴즈 진행 상태에 따라 UI가 명확히 바뀌도록 구성했습니다.

```text
오답 -> 힌트 제공
정답 -> 원본 이미지 제공 + 입력 비활성화
```

사용자가 현재 어떤 상태에 있는지 바로 이해할 수 있게 만드는 데 집중했습니다.

### 6. CRA에서 Vite + TypeScript로 마이그레이션

기존 CRA 기반 JavaScript 프로젝트를 Vite + TypeScript 환경으로 옮기면서 개발 생산성과 안정성을 함께 개선했습니다.

- 빌드 속도 개선
- 타입 정의 기반 안정성 확보
- 유지보수 편의성 향상

## 기술 스택

- React
- TypeScript
- Vite
- Styled Components
- React Query
- Recoil
- Firebase (Realtime Database / Cloud Functions)
- GitHub Actions

## 디렉터리 구조

```text
src/
├── app/
├── pages/
├── components/
│   ├── layout/
│   ├── cover/
│   ├── club/
│   ├── search/
│   └── submission/
├── hooks/
│   ├── ui/
│   ├── data/
│   └── quiz/
├── lib/
├── services/
├── state/
├── constant/
├── styles/
├── types/
└── utils/
```

앱 진입점, UI 컴포넌트, 데이터 훅, 퀴즈 로직을 역할별로 분리해 구조를 정리했습니다.

<!--
TODO: FSD 구조 변경 후 반영

현재는 기능 구현과 마이그레이션을 우선한 구조이며,
이후에는 FSD 구조로 파일 책임을 다시 정리하는 리팩터링을 진행할 예정입니다.
디렉터리 구조 문서는 실제 적용 이후에 갱신할 계획입니다.
-->

## 운영 및 측정

### Lighthouse

1. `npm run build` 후 `npx lhci collect` 또는 `npm run lhci`
2. `npm run sync:lighthouse-readme`
3. README의 아래 영역이 `.lighthouseci/lhr-*.json` 기준으로 갱신됩니다.

<!-- LIGHTHOUSE_SCORES_START -->

_(아직 측정하지 않았다면 1번을 실행한 뒤 2번을 실행합니다.)_

<!-- LIGHTHOUSE_SCORES_END -->

## 실행 방법

```bash
npm install
npm run dev
```

## 회고

이 프로젝트는 퀴즈 게임을 만드는 작업이기도 했지만,  
동시에 **API 제약이 있는 구조를 어떻게 안정적인 서비스 흐름으로 바꿀지**를 직접 실험한 프로젝트이기도 했습니다.

특히 서버리스 구조 전환, React Query 캐싱, Debounce 기반 입력 최적화, 검색 제약에 맞춘 UX 설계를 적용하면서:

- 데이터 요청 책임을 어디에 둘지
- 사용자 입력 흐름을 어떻게 부드럽게 만들지
- 로딩과 결과 상태를 어떻게 명확하게 전달할지

를 다시 정리할 수 있었습니다.

<!--
TODO: FSD 구조 변경 후 반영

또한 현재 구조는 기능 추가와 마이그레이션을 우선하며 확장해 온 형태라,
이후에는 FSD 방식으로 관심사를 더 명확히 분리해 유지보수성과 설명 가능성을 함께 높일 계획입니다.
-->

## 개선 방향

- 테스트 코드 도입
- 문제 다양성 확장
- 점수 및 랭킹 시스템
- Next.js 기반 확장

<!--
TODO: FSD 구조 변경 후 반영

- FSD 구조로 리팩터링해 feature / domain 단위 책임 재정리
-->

## 담당 역할

- 전체 프론트엔드 개발 (단독 프로젝트)
- UI 설계 및 사용자 인터랙션 구현
- 자동완성 검색 및 게임 로직 구현
- 상태 관리 및 데이터 흐름 설계
- 성능 최적화 (Debounce, 캐싱, preload)
