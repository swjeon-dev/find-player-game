import { useRecoilValue } from 'recoil'
import { leagueInfoState } from '@/atoms/quizState'
import { keyframes } from 'styled-components'
import styled, { css } from 'styled-components'

import Club from './Club'
import useFetchingTeamsDataInLeague from '../hooks/useFetchingTeamsDataInLeague'

// 왼쪽에서 오른쪽으로 빛이 지나가는 애니메이션
const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`

const SkeletonBase = styled.div`
  background: #eee;
  /* 그라데이션을 넓게 설정하고 배경 크기를 200%로 설정 */
  background-image: linear-gradient(90deg, #eee 0%, #c5c4c4c9 50%, #eee 100%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
`

const ClubSkeleton = styled(SkeletonBase)`
  min-width: 70px;
  aspect-ratio: 1/1;
  border-radius: 25%; // 원형 로고인 경우
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

const ClubViews = () => {
  const leagueInfo = useRecoilValue(leagueInfoState)
  const {
    isPending,
    error,
    teamsInLeague: teams,
  } = useFetchingTeamsDataInLeague(leagueInfo.id)

  if (error) {
    error && console.error(`팀 정보를 가져올 수 없습니다:`, error)
    return (
      <ClubContainer $isLoading style={{ display: 'block' }}>
        <span>현재 팀을 찾을 수 없습니다</span>
      </ClubContainer>
    )
  }

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

export default ClubViews
