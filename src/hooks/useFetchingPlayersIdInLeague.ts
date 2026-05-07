import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchPlayersIdInLeague } from '@/services/clientService'

const useFetchingPlayersIdInLeague = ({ leagueId }: { leagueId: number }) => {
  const queryClient = useQueryClient()

  const {
    isPending,
    error,
    data: playersId,
    refetch,
  } = useQuery<number[], Error>({
    queryKey: ['persist', 'players', 'ids', 'league', leagueId],
    queryFn: () => fetchPlayersIdInLeague(leagueId),
    enabled: !!leagueId,
  })

  useEffect(() => {
    if (!leagueId) return
    if (!Array.isArray(playersId) || playersId.length === 0) return
    queryClient.invalidateQueries({
      queryKey: ['players', 'league', leagueId],
    })
  }, [leagueId, playersId, queryClient])

  return { isPending, error, playersId, refetch }
}

export default useFetchingPlayersIdInLeague
