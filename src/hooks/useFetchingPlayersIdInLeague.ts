import { useQuery } from '@tanstack/react-query'

import { fetchPlayersIdInLeague } from '@/services/clientService'

const useFetchingPlayersIdInLeague = ({ leagueId }: { leagueId: number }) => {
  const {
    isPending,
    error,
    data: playersId,
  } = useQuery<number[], Error>({
    queryKey: ['persist', 'players', 'ids', 'league', leagueId],
    queryFn: () => fetchPlayersIdInLeague(leagueId),
    enabled: !!leagueId,
  })

  return { isPending, error, playersId }
}

export default useFetchingPlayersIdInLeague
