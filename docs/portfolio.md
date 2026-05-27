# Find Football Player Quiz - 상세 문서

Notion 등 포트폴리오 본문 작성을 위한 **내용 정리용** 문서입니다.  
`README.md`보다 조금 더 자세하게 **문제 정의, 해결 방식, 구현 포인트, 회고**를 정리했습니다.

## 프로젝트 요약

블러 처리된 프리미어리그 선수 이미지를 보고 정답을 맞추는 퀴즈 서비스입니다.

## 프로젝트 목적

1. **CRA(deprecated) + JavaScript → Vite + TypeScript 마이그레이션** — 개발 편의성 향상 및 안정성 개선
2. **외부 API 제약 환경 개선** — Rate Limit 등으로 인한 서비스 불안정 완화
3. **프론트엔드 관점에서 사용자 체감 개선**

## 문제

### 1. 외부 API 직접 의존 구조의 한계

초기 구조는 클라이언트가 외부 API를 직접 호출하는 방식이었습니다.

```text
Client → External API
```

이 방식은 구현은 단순했지만 다음 문제가 있었습니다.

- 외부 API Rate Limit
- 요청 실패 시 사용자 경험 저하
- 클라이언트에서 외부 API 안정성에 직접 영향받는 구조

### 2. 선수 검색 데이터 구조 제약

Firebase Realtime Database는 선수·팀 정보가 **id 중심 노드**로 나뉘어 저장됩니다. 조회 관점에서 보면 구조는 대략 다음과 같습니다.

```text
/leagues/{leagueId}/teamIds     → [teamId, ...]
/leagues/{leagueId}/playerIds   → [playerId, ...]

/teams/{teamId}/info            → 팀 상세
/teams/{teamId}/playerIds       → [playerId, ...]

/players/{playerId}/info        → 선수 상세
/players                        → 이름 prefix 검색 대상
```

실제 화면에서 필요한 데이터는 보통 한 번에 오지 않고, 아래처럼 **여러 단계**를 거칩니다.

```text
리그 선택
  → league의 teamIds / playerIds prefetch

팀 hover 또는 선택
  → team의 playerIds 조회

선수 목록·상세 표시
  → playerIds 기준으로 각 player info 조회
```

이 구조 때문에 다음 제약이 생겼습니다.

- 입력 값을 **포함(contains)** 하는 선수 검색을 유연하게 하기 어려움
- 전체 선수 데이터를 먼저 가져와 클라이언트에서 필터링하면 첫 조회가 10초 이상 소요
- 이름 검색은 **prefix(접두사) 일치** 쿼리로 우회해야 함

즉, 기술적으로 "contains 검색"을 억지로 흉내 내는 것만으로는 한계가 있고,  
**사용 흐름 설계**로 체감 대기 시간을 줄이는 방향이 더 현실적이었습니다.

### 3. 입력 과정의 렌더링 / 요청 비용

자동완성은 입력마다 즉시 반응할수록:

- 불필요한 연산
- 잦은 렌더링
- 중복 요청

이 늘어나기 쉬운 구조였습니다.

## 해결

### 1. CRA → Vite + TypeScript 마이그레이션

기존 CRA(deprecated) + JavaScript 프로젝트를 Vite + TypeScript 환경으로 옮겼습니다.

- 빌드 속도 개선
- 타입 안정성 확보
- 유지보수·개발 편의성 향상

### 2. Firebase 기반 서버리스 구조로 전환

클라이언트가 외부 API를 직접 호출하던 구조 대신, **Cloud Functions가 외부 API를 호출·적재하고 클라이언트는 Firebase Realtime Database만 조회**하는 서버리스 레이어를 두었습니다. (별도 백엔드 서버를 두는 대신, BFF에 가까운 중간 계층을 Firebase로 구성한 선택입니다.)

```text
Client → Firebase Realtime Database
        ↑
Cloud Functions
        ↑
External API
```

이 전환으로 Rate Limit·불안정한 직접 호출을 클라이언트 밖으로 분리했습니다.

### 3. 검색 UX 재설계

검색은 데이터 구조 한계를 인정하고 UX 방향으로 풀었습니다.

- 서버 쿼리는 **prefix(접두사) 일치 선수만 조회**
- **hover 기반 prefetch**로 다음 단계에 필요한 id·상세 데이터를 미리 준비
- 사용자는 **왼쪽 팀 메뉴 hover**로 선수 이름을 먼저 확인
- 이후 입력창에서 후보를 빠르게 좁히는 흐름으로 보완

즉, 검색 정확도만 억지로 높이기보다  
**제약 속에서도 사용할 수 있는 경험**을 우선했습니다.

### 4. React Query 기반 캐싱 / prefetch

서버 상태는 React Query로 관리했습니다. 이 프로젝트에서 성능 최적화의 중심은 **번들 분리보다 prefetch**였습니다.

- 리그 선택 모달 hover 시 `teamIds`, `playerIds`를 `prefetchQuery`로 미리 조회
- 팀 hover 시 `playerIds`와 모달 코드를 선로딩
- `localStorage` persist로 재방문 시 캐시 재사용
- 중복 요청 감소 및 비동기 상태 흐름 단순화

데이터가 `id 조회 → 상세 조회` 흐름을 거치기 때문에, 사용자가 다음 액션을 하기 전에 필요한 데이터를 미리 채워 두는 편이 체감 UX에 더 직접적인 효과가 있었습니다.

### 5. route-level lazy loading

`lazy loading`으로 초기 엔트리 청크에서 당장 필요하지 않은 화면 코드를 분리하는 방법을 학습했습니다.

| 대상             | 적용 위치                      | 효과 (번들 기준)                                                                               |
| ---------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `Submission`     | `src/app/router.tsx`           | 홈 첫 진입 엔트리 청크 gzip **약 4.59 KiB** 감소, 라우트 이동 시 별도 청크(~5.7 KiB gzip) 로드 |
| `ClubSquadModal` | `src/components/club/Club.tsx` | `Submission` 청크 gzip **약 0.52 KiB** 감소, hover 시 별도 청크(~1.3 KiB gzip) 로드            |

`vite.config.js`의 `manualChunks`로 `@tanstack` 계열을 `vendor-query`로 분리했습니다. `@tanstack/react-query`는 `src/index.tsx`에서 루트부터 로드되므로 **첫 방문 시 총 다운로드량은 거의 동일**하고, 메인 엔트리 청크 gzip **약 10.9 KiB** 감소·앱·라이브러리 캐시 단위 분리가 주된 효과였습니다.

### 6. Debounce 기반 입력 최적화

자동완성 입력은 Debounce 로직을 커스텀 훅으로 분리해 안정화했습니다.

- 입력 빈도에 맞춘 검색 지연
- 동일 값 재반영 방지
- 자동완성 렌더링 횟수 감소

### 7. 상태 기반 UI 전환

퀴즈는 상태에 따라 UI가 명확히 달라지도록 설계했습니다.

```text
오답 -> 힌트 제공
정답 -> 원본 이미지 제공 + 입력 비활성화
```

이 흐름을 통해 사용자가 현재 상황을 바로 이해할 수 있도록 했습니다.

## 성과

이 프로젝트를 통해 다음 성과를 얻었습니다.

- **CRA(deprecated) + JavaScript → Vite + TypeScript** 마이그레이션으로 개발 편의성·안정성 개선
- 클라이언트의 외부 API 직접 호출을 **Firebase(Cloud Functions + Realtime Database) 서버리스 레이어**로 대체해 Rate Limit 환경 개선
- id 중심 DB 구조의 조회 제약을 **prefetch·UX 설계**로 완화
- React Query, Debounce, 상태 기반 UI를 통해 **입력과 결과 흐름의 체감 품질 개선**
- route-level `lazy loading`·vendor chunk 분리로 **초기 엔트리 청크 분리 및 번들 구조 정리** (번들 기준, 해결 §5)

## 회고

이 프로젝트를 통해 정리할 수 있었던 질문은 다음과 같습니다.

- 데이터 요청 책임을 어디에 둬야 하는가
- 입력 UX를 어떻게 자연스럽게 설계할 것인가
- API·DB 제약이 있을 때 어떤 방향으로 구조를 바꿔야 하는가
- **프론트엔드 관점에서** 성능·체감 문제를 어떻게 풀어야 하는가

검색, 다단계 데이터 조회, 번들 최적화 모두에서 같은 결론에 도달했습니다.  
"이상적인 기술 구현"이나 수치만 줄이는 것보다, **제약 속에서 사용자가 덜 답답하게 느끼는 경험**을 만드는 것이 더 중요했습니다. 검색은 prefix 쿼리·hover 보조·prefetch로, 성능은 prefetch와 lazy·chunk 분리로 이 방향을 맞추었습니다.

### 성능 최적화에 대한 정리

이 프로젝트에서는 **데이터 조회 구조 때문에 prefetch가 더 중요한 포인트**였습니다. `lazy`·vendor chunk 분리도 적용했지만, 현재 규모에서는 체감 효과가 상대적으로 작았습니다.

**이번 프로젝트에서 한 일**

- prefetch로 다단계 조회(`id → 상세`)의 체감 대기 시간 완화
- `Submission` lazy로 홈 첫 진입 엔트리 청크 분리
- `ClubSquadModal` lazy로 hover 시점까지 모달 코드 분리
- `manualChunks`로 메인 엔트리·라이브러리 캐시 단위 분리

**실제 서비스에서의 활용 방향**

화면·의존성이 더 많은 **실제 운영 서비스**에서는 같은 패턴을 더 적극적으로 쓸 수 있다고 봅니다.

- **lazy loading**: 초기 진입 부담 완화, 라우트 전환 시 불필요한 코드 지연 로딩
- **vendor chunk 분리**: 재배포 후 앱 코드만 바뀔 때 라이브러리 청크 캐시 재사용
- **prefetch**: 조회가 여러 단계인 API·DB 구조에서 여전히 우선순위가 높음

조회 API가 단순한 환경이라면 chunk 분리만으로도 초기 진입·캐시 효율 개선을 더 직접적으로 가져갈 수 있을 것입니다.

### CSR 앱을 정적 호스팅에 배포했을 때 겪은 문제

GitHub Pages에 배포한 뒤, `/submission` 페이지는 **앱 내부 이동으로 들어갈 때는 정상 동작했지만 새로고침이나 직접 접근 시 GitHub 404 페이지가 나타나는 문제**가 있었습니다.

처음에는 `ProtectedRoute`나 `Navigate` 처리 문제라고 생각했지만,  
실제로는 **React 앱이 실행되기 전에 GitHub Pages가 먼저 해당 경로에 대응하는 정적 파일을 찾다가 404를 반환하는 구조**가 원인이었습니다.

제가 실제로 사용한 라우터 구조는 아래와 같았습니다.

```ts
{
  path: routerPath.SUBMISSION,
  element: <ProtectedRoute />,
  children: [
    {
      index: true,
      element: <Submission />,
    },
  ],
},
{
  path: '*',
  element: <NotFound />,
}
```

그리고 `ProtectedRoute`는 리그 선택 정보가 없으면 홈으로 보내는 방식이었습니다.

```ts
if (!leagueInfo.id) {
  alert('먼저 리그를 선택해주세요.')
  return <Navigate to={routerPath.HOME} replace />
}

return <Outlet />
```

앱이 이미 실행된 상태에서 `/submission`으로 이동하면 이 로직은 정상적으로 동작합니다.  
하지만 GitHub Pages에서 `/submission`을 직접 요청하면, React Router가 경로를 해석하기 전에 서버가 먼저 `/submission`에 해당하는 정적 파일을 찾습니다.

즉:

- 메인 페이지에서 이동: React 앱 실행 후 `ProtectedRoute` 동작
- 직접 접근 / 새로고침: 정적 서버가 먼저 파일 탐색 -> 없으면 GitHub 404 반환

그래서 `path: '*'`로 만든 `NotFound` 페이지도,  
앱이 실행되지 못한 상황에서는 적용되지 않는다는 점을 확인할 수 있었습니다.

### 현재 선택한 방식

현재는 `BrowserRouter` 기반 구조를 유지하면서,

- 앱이 실행된 뒤의 잘못된 경로는 `NotFound` 페이지로 처리하고
- `ProtectedRoute`가 적용된 `/submission` 경로를 직접 요청하거나 새로고침할 때는 fallback으로 앱을 다시 실행한 뒤, session 데이터가 없으면 홈으로 리다이렉트되도록 처리했습니다

이 과정을 통해 "로컬에서는 되는데 배포에서는 안 되는 이유"를
React 코드가 아니라 **호스팅 서버의 동작 관점**에서 설명할 수 있게 된 점이 의미 있는 학습 포인트였습니다.

<!--
검토했던 방법

1. HashRouter
- /#/submission 형태가 되어 서버는 루트 경로만 보고, hash 뒤는 브라우저가 해석
- 직접 접근 404를 피할 수 있음
- 다만 URL이 덜 깔끔해서 데스크톱 웹 서비스 포트폴리오 관점에서는 아쉽다고 생각했다

2. 404.html fallback
- index.html을 404.html로도 제공하면 GitHub Pages의 404 응답을 앱 재진입 지점으로 활용 가능
- 현재 구조를 크게 바꾸지 않고 새로고침 문제를 우회할 수 있음
- 다만 배포 산출물에 fallback 파일을 별도로 관리해야 하고, 정적 404 페이지가 아니라 앱을 다시 실행시키는 우회 엔트리라는 점에서 특수한 처리

참고 메모: 우선순위는 낮지만, 배포/라우팅 제약 설명이 필요할 때 다시 살릴 수 있는 내용

React Router의 BrowserRouter는 기본적으로:

index.html 로드
-> JS 실행
-> Router가 현재 URL 해석
-> ProtectedRoute / 페이지 컴포넌트 렌더

같은 흐름을 기대합니다.

하지만 GitHub Pages 같은 정적 호스팅은:

/submission 요청
-> 서버가 /submission 에 해당하는 실제 정적 파일 탐색
-> 없으면 GitHub 404 반환

처럼 동작합니다.

즉, 정적 서버에서는 React 앱이 실행되기 전에 먼저 파일 존재 여부를 확인하기 때문에,
직접 URL 접근이나 새로고침 시에는 ProtectedRoute, Navigate, NotFound 같은 React 컴포넌트까지 도달하지 못할 수 있습니다.

반면 Vercel, Netlify, Firebase Hosting처럼 rewrite 설정이 가능한 호스팅은 보통:

모든 경로 요청
-> index.html 반환
-> React 앱 실행
-> 클라이언트 라우터가 URL 해석

흐름으로 처리할 수 있어, 같은 CSR 구조라도 새로고침 문제를 덜 겪습니다.

rewrite:
사용자가 어떤 경로로 들어오더라도 서버가 그 경로에 대응하는 실제 파일을 찾는 대신,
앱 엔트리 파일(index.html)을 반환하도록 바꾸는 처리

fallback:
정적 서버의 404 응답을 앱 재진입 지점으로 바꾸는 우회 방식
예: /submission -> 파일 없음 -> 404.html 반환 -> React 앱 실행 -> 라우터가 URL 다시 해석

HashRouter:
URL에서 서버가 해석하는 부분과 클라이언트가 해석하는 부분을 분리하는 방식
예: /find-player-game/#/submission
서버는 /find-player-game/ 까지만 보고, # 이후는 브라우저/클라이언트가 해석
-->

## 향후 개선 방향

- 테스트 코드 도입
- 문제 다양성 확장
- 점수 및 랭킹 시스템
- Next.js 기반 확장
- 파일 구조 리팩터링
- rewrite가 가능한 호스팅으로 이전하거나, fallback 범위를 다른 경로까지 확장 검토
