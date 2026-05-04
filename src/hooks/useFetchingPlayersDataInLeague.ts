import { useQuery } from '@tanstack/react-query'

import { fetchPlayersDataInLeague } from '@/services/clientService'
import { REACT_QUERY_OPTIONS } from '@/api'
import type { IFirebasePlayer } from 'shared/api.types'

const useFetchingPlayersDataInLeague = (
  leagueId: number,
  options?: {
    initialData?: IFirebasePlayer[]
    enabled?: boolean
  },
) => {
  const queryKeys = [leagueId, 'league', 'players'] as const

  const {
    isPending,
    error,
    data: playersInLeague,
  } = useQuery<IFirebasePlayer[], Error>({
    queryKey: queryKeys,
    queryFn: () => fetchPlayersDataInLeague(leagueId),
    initialData: options?.initialData,
    enabled: options?.enabled,
    ...REACT_QUERY_OPTIONS,
  })

  return { isPending, error, playersInLeague }
}

export default useFetchingPlayersDataInLeague
