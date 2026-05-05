import { useQuery } from '@tanstack/react-query'

import { fetchPlayersDataInLeague } from '@/services/clientService'
import type { IFirebasePlayer } from 'shared/api.types'

const useFetchingPlayersDataInLeague = ({ leagueId }: { leagueId: number }) => {
  const {
    isPending,
    isFetching,
    error,
    data: playersInLeague,
  } = useQuery<IFirebasePlayer[], Error>({
    queryKey: ['players', 'league', leagueId],
    queryFn: () => fetchPlayersDataInLeague(leagueId),
    enabled: leagueId !== 0,
  })

  return { isPending, isFetching, error, playersInLeague }
}

export default useFetchingPlayersDataInLeague
