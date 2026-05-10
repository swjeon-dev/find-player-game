import { useRecoilValue } from 'recoil'

import useFetchingPlayersDataInLeague from '@/hooks/useFetchingPlayersDataInLeague'
import useFetchingPlayersIdInLeague from '@/hooks/useFetchingPlayersIdInLeague'
import { leagueInfoState } from '@/state'
import SubmissionCard from './components/SubmissionCard'
import { SubmissionLoader } from './components/SubmissionLoader'
import { Container } from './styles'

export default function SubmissionGameContainer() {
  const leagueInfo = useRecoilValue(leagueInfoState)

  const {
    isPending: isIdsPending,
    error: idsError,
    playersId,
    refetch: refetchPlayersId,
  } = useFetchingPlayersIdInLeague({
    leagueId: leagueInfo.id,
  })
  const {
    isPending: isPlayersPending,
    error: playersError,
    playersInLeague: squad,
  } = useFetchingPlayersDataInLeague({
    leagueId: leagueInfo.id,
    playerIds: playersId,
  })

  const isPending = isIdsPending || isPlayersPending
  const isSearchUnavailable = !!idsError || !!playersError
  const retryFetching = () => {
    refetchPlayersId()
  }

  if (isSearchUnavailable) {
    return (
      <SubmissionLoader
        message='선수 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'
        onRetry={retryFetching}
      />
    )
  }
  return (
    <Container>
      <SubmissionCard isPending={isPending} squad={squad ?? []} />
    </Container>
  )
}
