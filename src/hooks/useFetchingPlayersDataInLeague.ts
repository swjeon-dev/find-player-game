// import { useQuery } from '@tanstack/react-query'

// import { fetchPlayersDataInLeagueByIds } from '@/services/clientService'
// import type { IFirebasePlayer } from '@/api/api.types'
// import { queryKeysMain } from '@/lib/queryKeys'

// export default function useFetchingPlayersDataInLeague({
//   leagueId,
//   playerIds,
// }: {
//   leagueId: number
//   playerIds: number[] | undefined
// }) {
//   const isReady = !!leagueId && Array.isArray(playerIds) && playerIds.length > 0

//   const {
//     isPending,
//     error,
//     data: playersInLeague,
//     dataUpdatedAt,
//   } = useQuery<IFirebasePlayer[], Error>({
//     queryKey: queryKeysMain.players.byLeague(leagueId),
//     queryFn: () => fetchPlayersDataInLeagueByIds(playerIds),
//     enabled: isReady,
//   })

//   return { isPending, error, playersInLeague, dataUpdatedAt }
// }
