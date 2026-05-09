import { useRecoilValue } from 'recoil'
import styled, { css } from 'styled-components'

import { leagueInfoState } from '@/state'
import { SkeletonBase } from '@/utils/skeletonUI'
import Club from './Club'
import useFetchingTeamsDataInLeague from '../hooks/useFetchingTeamsDataInLeague'

import ProfileComp from './Profiler'

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
  // const isInitialLoading = teamIdsQuery.isPending
  // const isAnyTeamLoading = teamDatasQuery.some(q => q.isPending)

  return (
    <ProfileComp id='ClubViews'>
      dafd
      {/* <ClubContainer $isLoading={isInitialLoading || isAnyTeamLoading}>
        {isInitialLoading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <ClubSkeleton key={idx} />
            ))
          : teamDatasQuery.map((q, idx) =>
              q.data ? (
                <Club key={q.data.id} {...q.data} />
              ) : (
                <ClubSkeleton key={idx} />
              ),
            )}
      </ClubContainer> */}
    </ProfileComp>
  )
}

export default ClubViews
