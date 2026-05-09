import { useQuery } from '@tanstack/react-query'

import { fetchPlayer, fetchTeamPlayerIds } from '../services/clientService'
import type { IFirebasePlayer } from '@/api/api.types'
import { queryKeysMain } from '@/lib/queryKeys'

// 48 웨햄, 50 맨시티 선수 목록 조회 실패 확인
const useFetchingTeamPlayersData = (teamId: number) => {
  const {
    isPending,
    error,
    data: playerInTeam,
  } = useQuery<IFirebasePlayer[], Error>({
    queryKey: queryKeysMain.players.byTeam(teamId),
    queryFn: async () => {
      const playerIds = await fetchTeamPlayerIds(teamId)
      const requestPromise = playerIds.map(id => fetchPlayer(id))
      const players = await Promise.all(requestPromise).then(result =>
        result.flat(),
      )

      return players
    },
  })

  return { isPending, error, playerInTeam }
}

export default useFetchingTeamPlayersData
