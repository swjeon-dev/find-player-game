import { useRecoilValue } from 'recoil'
import styled, { css } from 'styled-components'

import { leagueInfoState } from '@/state'
import { SkeletonBase } from '@/utils/skeletonUI'
import Club from './Club'
import ProfileComp from './Profiler'
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
    display: none;
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

  return (
    <>
      {/* <ProfileComp id='ClubViews'> */}
      <ClubContainer $isLoading={isInitialLoading || isAnyTeamLoading}>
        {isInitialLoading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <ClubSkeleton key={idx} />
            ))
          : teamDatasQuery.map((q, idx) =>
              // <>
              //   <ProfileComp key={q.data.id} id={`Club-${q.data.id}`}>
              //   </ProfileComp>
              //   </>
              q.data ? (
                <Club key={`club-${q.data.id}`} {...q.data} />
              ) : (
                <ClubSkeleton key={idx} />
              ),
            )}
      </ClubContainer>
      {/* </ProfileComp> */}
    </>
  )
}

export default ClubViews
