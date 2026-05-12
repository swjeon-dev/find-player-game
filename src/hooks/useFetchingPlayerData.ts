import { useQuery } from '@tanstack/react-query'

import { fetchPlayer } from '@/services/clientService'
import type { IFirebasePlayer } from '@/api/api.types'
import { queryKeysMain } from '@/lib/queryKeys'

export default function useFetchingPlayerData({
  playerId,
  enabled,
}: {
  playerId: number
  enabled: boolean
}) {
  const {
    isPending,
    error,
    data: player,
    refetch,
  } = useQuery<IFirebasePlayer, Error>({
    queryKey: queryKeysMain.players.one(playerId),
    queryFn: () => fetchPlayer(playerId),
    enabled,
  })

  return { isPending, error, player, refetch }
}
