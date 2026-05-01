# ⚽ Find Player Game

![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat-square&logo=GitHub%20Actions&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://software92.github.io/find-player-game/)
![Deploy Status](https://img.shields.io/github/actions/workflow/status/software92/find-player-game/deploy.yml?branch=master&style=flat-square&label=Deploy&logo=GitHub%20Actions&logoColor=white)

## 서비스 화면

|                 Loading                  |                         Entry                          |                       자동완성                       |
| :--------------------------------------: | :----------------------------------------------------: | :--------------------------------------------------: |
| ![loading](src/assets/imgs/loading.webp) | ![main-interface](src/assets/imgs/main-interface.webp) | ![auto-complete](src/assets/imgs/auto-complete.webp) |

|                 힌트                 |                  정답                  |
| :----------------------------------: | :------------------------------------: |
| ![hints](src/assets/imgs/hints.webp) | ![result](src/assets/imgs/result.webp) |

## 1. 프로젝트 소개

외부 API의 Rate Limit 문제를 해결하기 위해
서버리스 구조로 개선한 퀴즈형 웹 서비스입니다.

블러 처리된 프리미어리그 선수 이미지를 보고
선수를 맞추는 게임으로,

단순한 게임 구현을 넘어
데이터 요청 구조 개선과 사용자 입력 흐름 최적화에 초점을 두고 개발했습니다.

## 2. 아키텍처

```text
[기존]
Client → External API

[개선]
Client → Firebase Realtime Database
        ↑
Cloud Functions (데이터 수집)
        ↑
External API
```

- 클라이언트는 외부 API를 호출하지 않고 DB만 조회
- Cloud Functions를 통해 데이터를 수집하고 DB에 저장
- API 의존도를 제거하고 안정적인 데이터 제공 구조로 개선
- 단순 데이터 조회 중심 서비스 특성상, 복잡한 서버 없이 빠르게 구축 가능한 서버리스 구조를 선택

## 3. 문제 해결

### 문제

- 외부 API Rate Limit으로 인해 요청 제한 발생
- 자동완성 입력 시 불필요한 API 요청 및 렌더링 증가
- 초기 로딩 시 데이터 요청 지연으로 UX 저하

### 해결

1. 서버리스 아키텍처 도입
   - Firebase 기반 구조로 변경
   - Cloud Functions로 데이터 수집
   - Realtime Database에 저장 후 클라이언트 조회

     -> API 의존도 제거, 서비스 안정성 및 가용성 확보

2. React Query 기반 데이터 관리
   - 서버 상태를 캐싱해서 중복 요청 방지
   - 초기 데이터 preload

   ```typescript
   const useFetchingTeamData = (teamId: number) => {
     const { isPending, error, data } = useQuery<IFirebaseTeamDetail, Error>({
       queryKey: [teamId, 'total', 'team'],
       queryFn: () => fetchTeam(teamId),
       staleTime: 1000 * 60,
     })

     return { isPending, error, team }
   }
   ```

   → 불필요한 요청 감소 및 응답 속도 개선

3. Debounce 기반 검색 성능 최적화

- 자동완성 입력마다 상태가 업데이트가 발생하면서 불필요한 연산과 리렌더링이 증가하는 문제가 발생

- 이를 해결하기 위해 Debounce 로직을 커스텀 훅으로 구현
- 이전 값과 동일한 경우 상태 업데이트를 방지하기 위해 `Object.is`를 사용

```typescript
function useDebouncedValue<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(prev => (Object.is(prev, value) ? prev : value))
    }, ms)

    return () => clearTimeout(timer)
  }, [value, ms])

  return debouncedValue
}
```

```typescript
const debouncedValue = useDebouncedValue(value, 500)
```

## 4. 사용자 경험 및 성능 개선

### 자동완성 + 클릭 입력

- 선수 이름 자동완성 제공
- 팀 이미지 hover 시 선수 목록 확인 및 입력 지원
  -> 입력 편의성 향상 및 사용자 진입 장벽 감소

### 상태 기반 UI 변화

```text
오답 -> 힌트 제공
정답 -> 원본 이미지 제공 + 입력 비활성화
```

### 초기 로딩 개선

- 데이터 preload + Skeleton UI 적용
  -> 로딩 지연 최소화 및 자연스러운 화면 제공

### 마이그레이션

기존 CRA 기반 JavaScript 프로젝트를  
Vite + TypeScript 환경으로 마이그레이션했습니다.

- 빌드 속도 개선 및 개발 생산성 향상
- 타입 정의를 통한 안정성 확보

## 5. 기술 스택

- React
- Styled Components
- TypeScript
- React Query
- Github Actions
- Recoil
- Firebase (Realtime Database / Cloud Functions)

## 6. 기술 선택 이유

### React Query

서버 상태를 캐싱해 중복 요청을 줄이고 데이터 흐름 단순화

### Recoil

전역 상태를 atom 단위로 관리하여 간결한 구조 유지

### Firebase

서버 없이 데이터 저장과 처리 가능한 서버리스 환경으로 빠른 구조 개선 가능

### Github Actions

초기에는 데이터 업데이트 자동화를 위해 사용

(현재는 데이터 특성상 수동 업데이트 방식으로 운영)

## 7. 담당 역할

- 전체 프론트엔드 개발 (단독 프로젝트)
- UI 설계 및 사용자 인터랙션 구현
- 자동완성 검색 및 게임 로직 구현
- 상태 관리 및 데이터 흐름 설계
- 성능 최적화 (Debounce, 캐싱, preload)

## 8. 결과

- API Rate Limit으로 인한 요청 제한 없이 안정적인 서비스 제공
- 불필요한 API 요청 감소 및 데이터 응답 안정성 확보
- 사용자 입력 시 지연 없이 자연스러운 인터랙션 경험 제공

## 9. 개선 방향

- 테스트 코드 도입
- 문제 다양성 확장
- 점수 및 랭킹 시스템
- Next.js 기반 확장

## 10. 실행

```bash
npm install
npm run dev
```
