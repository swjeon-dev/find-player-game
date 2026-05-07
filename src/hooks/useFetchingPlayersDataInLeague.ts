import { useQuery } from '@tanstack/react-query'

import { fetchPlayersDataInLeagueByIds } from '@/services/clientService'
import type { IFirebasePlayer } from '@/api/api.types'

const useFetchingPlayersDataInLeague = ({
  leagueId,
  playerIds,
}: {
  leagueId: number
  playerIds: number[] | undefined
}) => {
  const isReady = !!leagueId && Array.isArray(playerIds) && playerIds.length > 0

  const {
    isPending,
    error,
    data: playersInLeague,
  } = useQuery<IFirebasePlayer[], Error>({
    queryKey: ['players', 'league', leagueId],
    queryFn: () => fetchPlayersDataInLeagueByIds(playerIds),
    enabled: isReady,
  })

  return { isPending, error, playersInLeague }
}

export default useFetchingPlayersDataInLeague
