# ⚽️ Find Football Player Quiz

![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=GitHub%20Actions&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://software92.github.io/find-player-game/)
![Deploy Status](https://img.shields.io/github/actions/workflow/status/software92/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

기존의 서비스를 유지하며 개발 생산성과 런타임 안정성을 높이기 위해 마이그레이션을 진행했습니다.(JS, CRA -> TS, Vite)

축구 선수의 실루엣과 힌트를 보고 이름을 맞추는 인터랙티브 퀴즈 웹 어플리케이션입니다. 랜덤하게 생성되는 선수 데이터를 바탕으로 사용자가 이름을 검색하고 정답을 맞추는 과정을 담고 있습니다. 데이터 로딩 최적화와 상태 유지에 중점을 두고 개발했습니다.

## 📌 Overview

- SPA 구조 기반 페이지 전환
- 선수 및 팀 정보 조회
- Firebase Cloud Functions를 이용한 데이터 동기화
- GitHub Actions를 통한 자동 배포

## 🛠 Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white)
![Recoil](https://img.shields.io/badge/Recoil-3578E5?style=flat-square&logo=Recoil&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=flat-square&logo=React%20Query&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=Axios&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled%20Components-DB7093?style=flat-square&logo=styled-components&logoColor=white)

### 주요 선택 이유

- **React**: 컴포넌트 기반 SPA 구조를 통해 UI 재사용성과 유지보수성 확보
- **TypeScript**: API 응답 데이터 타입 안정성 확보를 통한 런타임 오류 방지
- **Vite**: 빠른 개발 서버 환경과 빌드 속도 개선 및 GitHub Pages 배포 최적화
- **Styled Components**: UI와 로직을 분리하여 컴포넌트 단위로 스타일을 관리
- **React Query**: 캐싱을 활용하여 불필요한 API 요청을 줄이고, 비동기 상태 관리를 간결하게 처리
- **Recoil**: 전역 상태를 가볍고 직관적으로 관리
- **Axios**: HTTP 요청 인스턴스화를 통해 공통 헤더 및 API 설정을 구조화

## 📂 4. Architecture

```text
src/
├── assets/           # 이미지
├── routes/           # 라우터 설정 및 데이터 로더
├── api/              # Firebase API 인스턴스 로직 (firebaseClient.ts)
├── constant/         # API 엔드포인트, 라우터 경로
├── components/       # 공통 UI 및 레이아웃 컴포넌트
├── pages/            # 독립적인 페이지 컴포넌트
├── hooks/            # 데이터 페칭(React Query), 퀴즈 생성 로직, 디바운스 등 커스텀 훅
├── atoms/            # 퀴즈 데이터 및 입력값 전역 상태 관리
├── services/         # Firebase Admin SDK 기반 데이터 동기화 및 클라이언트 서비스 로직
├── styles/           # 전역 스타일 및 테마 정의
├── types/            # firebase API 응답 데이터 타입 정의
└── utils/            # 유틸리티 함수
```

## 🎨 3. Key Features & Logic

- API 모듈 및 공통 컴포넌트 분리로 재사용성 확보
- 퀴즈를 세션 스토리지에 저장해서 문제 변경 버튼을 누르기전까지 문제 유지
- screen 크기에 따라 레이아웃 최적화
- 환경 변수를 사용한 API KEY 및 서버 요청 토큰 관리
- GitHub Actions CI/CD 자동 배포

### 🚀 Migration: JS (CRA) to TS (Vite)

기존의 서비스를 유지하며 개발 생산성과 런타임 안정성을 높이기 위해 마이그레이션을 진행했습니다.

| 항목       | 기존          | 변경       | 이유                                                            |
| ---------- | ------------- | ---------- | --------------------------------------------------------------- |
| Build Tool | Webapack(CRA) | Vite       | legacy한 빌드 툴 사용을 중단하고, 개발 속도 80% 향상            |
| Language   | Javascript    | Typescript | 정적 타입 체크를 통한 런타임 에러 사전 방지 및 코드 편의성 향상 |

### ✅ Firebase Serverless

외부 Football API의 일일 호출 제한(Rate Limit)을 해결하기 위해 서버리스 아키텍처를 구축했습니다.

Firebase Admin SDK: 클라이언트 권한을 넘어서는 데이터 입력 및 조회

Cloud Functions: GitHub Actions와 연동된 synchronization을 통해 필요시 데이터를 동기화합니다.

### ✅ Search Optimization (Debounce)

검색창 입력 시마다 발생하는 불필요한 리렌더링과 데이터 필터링 연산을 방지하기 위해(자동완성 목록) `useDebouncedValue` 커스텀 훅을 구현헀습니다.

```typescript
import { useEffect, useState } from 'react'

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, ms)

    return () => clearTimeout(timer)
  }, [value, ms])

  return debouncedValue
}
```

### ✅ Skeleton UI

실제 UI 구조와 유사한 스켈레톤 박스를 배치해서 시각적 안정감을 제공합니다.

```typescript
{
    // ...
    const showSkeleton = isPending || !teams || teams.length === 0

    return (
      <ClubContainer $isLoading={isPending}>
        {showSkeleton
          ? Array.from({ length: 18 }).map((_, idx) => {
              return <ClubSkeleton key={idx} />
            })
          : teams.map(club => <Club key={club.id} {...club} />)}
      </ClubContainer>
    )
}
```

### ✅ Persistence State (상태 유지)

`recoil-persist`를 활용하여 sessionStorage에 퀴즈 상태를 저장합니다. 버튼을 사용해 퀴즈를 바꾸기전까지 문제를 유지합니다.

```typescript
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import type { IFirebasePlayer } from 'shared/api.types'

const { persistAtom } = recoilPersist({
  key: 'quiz',
  storage: sessionStorage,
})

export const quizState = atom<IFirebasePlayer | null>({
  key: 'player',
  default: null,
  effects_UNSTABLE: [persistAtom],
})
```

---

## ⚙️ 5. Getting Started (시작하기)

1. 저장소 복제

```Bash
git clone https://github.com/your-username/find-football-player.git
```

2. 패키지 설치

```Bash
npm install
```

3. 로컬 서버 실행

```Bash
npm run dev
```

## 🚀 Troubleshooting

### 외부 API Rate Limit 대응

무료 API 플랜의 제한(1분당 10회)으로 인해 수백 명의 선수 데이터를 한 번에 가져올 때 동기화가 중단되는 문제가 있었습니다.

이를 해결하기 위해 **재시도 로직**과 **강제 지연(sleep) 함수**를 Cloud Functions에 도입하여 안정적인 데이터 파이프라인을 구축했습니다.

## 🚀 Deployment

- GitHub Pages
- GitHub Actions를 통해 master 브랜치 push 및 pull-request 시 자동 배포

## 🖥️ Screenshot

### 1. 초기 진입 및 로딩 (Loading & Entry)

앱 실행 시 React Query의 상태에 따라 Skeleton UI를 노출하여 시각적 안정감을 제공하고, 데이터 로딩이 완료되면 메인 퀴즈 화면으로 전환합니다.

![loading](src/assets/imgs/loading.webp)
![main-interface](src/assets/imgs/main-interface.webp)

### 2. 실시간 검색 및 자동완성 (Search & Auto-complete)

`useDebouncedValue` 훅을 활용해 사용자 입력을 최적화해서 선수 검색 기능을 제공합니다. 불필요한 API 요청을 최소화하며 실시간으로 선수 목록을 필터링합니다.

![auto-complete](src/assets/imgs/auto-complete.webp)

### 3. 힌트 제공 및 정답 확인 (Hints & Result)

오답 제출 시 소속 팀, 국적, 포지션 등 단계별 힌트가 활성화됩니다. 정답을 맞출 경우 세션 스토리지에 상태를 저장하여 진행 상황을 유지합니다.

![hints](src/assets/imgs/hints.webp)
![result](src/assets/imgs/result.webp)
