import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled, { css } from 'styled-components'

import useBreakpoint from '@/hooks/useBreakpoint'
import { leagueInfoState } from '@/state'
import { SkeletonBase } from '@/utils/skeletonUI'
import Club from './Club'
import useFetchingTeamsDataInLeague from '../hooks/useFetchingTeamsDataInLeague'

const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  justify-content: center;
  align-items: center;

  height: 140px;
  padding: 10px;
  border-radius: 12px;

  background-color: #ffdddd;
  color: #b00020;

  font-size: 0.85rem;
`

const RetryButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  background: #b00020;
  color: white;
`

const ClubSkeleton = styled(SkeletonBase)`
  min-width: 70px;
  aspect-ratio: 1/1;
  border-radius: 25%;
  margin: auto;
`

/** 태블릿에서만 렌더: 팀 그리드 패널 열기/닫기 */
const TabletToggleButton = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 101;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  background: #023047;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`

interface IClubContainer {
  $isLoading: boolean
}

const ClubContainer = styled.div<IClubContainer>`
  grid-template-columns: repeat(3, 1fr);

  ${props =>
    props.$isLoading
      ? css`
          cursor: wait;
        `
      : css`
          cursor: auto;
        `}

  display: grid;
  background-color: #8ecae6;

  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  max-width: 250px;

  min-height: 80px;
  height: fit-content;
  border-radius: 15px;

  z-index: 31;

  ${props => props.theme.media.tablet} {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    height: fit-content;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 100;
  }
`

// TODO: update가 6번 발생. 확인
/**
 * 
| 컴포넌트        | mount |   update |    총 렌더링 |
| ----------- | ----: | -------: | -------: |
| `ClubViews` |    1회 |       9회 |      10회 |
| `Club`      |   12회 | 약 39~40회 | 약 51~52회 |

성능에 문제는 없지만 리렌더링 횟수가 많음.
1. club 컴포넌트 메모제이션
2. array 컴포넌트의 index를 id로 변경
> 횟수 변화
 actualDuration < baseDuration
패턴이 반복되는 것은 React가 memo 비교 후 렌더를 skip했다는 의미입니다.
| 컴포넌트        | mount | update | 총 렌더링 |
| ----------- | ----: | -----: | ----: |
| `ClubViews` |    1회 |     6회 |    7회 |
| `Club`      |   10회 |     0회 |   10회 |


 */
const ClubViews = () => {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const { teamIdsQuery, teamDatasQuery } = useFetchingTeamsDataInLeague(
    leagueInfo.id,
  )
  const { isAtMost } = useBreakpoint()
  const isTablet = isAtMost('tablet')
  const [isTabletOpen, setIsTabletOpen] = useState(false)

  useEffect(() => {
    if (!isTablet) {
      setIsTabletOpen(false)
    }
  }, [isTablet])

  if (teamIdsQuery.error) {
    return (
      <ErrorBox>
        <span>팀 데이터를 불러오지 못했습니다</span>
        <RetryButton onClick={() => teamIdsQuery.refetch()}>
          다시 시도
        </RetryButton>
      </ErrorBox>
    )
  }
  const isInitialLoading = teamIdsQuery.isPending
  const isAnyTeamLoading = teamDatasQuery.some(q => q.isPending)

  const showClubGrid = !isTablet || isTabletOpen

  const closeTablet = () => setIsTabletOpen(v => !v)

  return (
    <>
      {isTablet && (
        <TabletToggleButton
          type='button'
          aria-expanded={isTabletOpen}
          onClick={closeTablet}
        >
          {isTabletOpen ? '팀 목록 닫기' : '팀 목록 열기'}
        </TabletToggleButton>
      )}

      {showClubGrid && (
        <ClubContainer $isLoading={isInitialLoading || isAnyTeamLoading}>
          {isInitialLoading
            ? Array.from({ length: 12 }).map((_, idx) => (
                <ClubSkeleton key={idx} />
              ))
            : teamDatasQuery.map((q, idx) =>
                q.data ? (
                  <Club
                    key={`club-${q.data.id}`}
                    {...q.data}
                    offTablet={closeTablet}
                  />
                ) : (
                  <ClubSkeleton key={idx} />
                ),
              )}
        </ClubContainer>
      )}
    </>
  )
}

export default ClubViews
