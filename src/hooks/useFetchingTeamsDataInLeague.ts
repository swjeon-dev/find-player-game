import {
  useQueries,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { fetchTeam, fetchTeamIdsInLeague } from '../services/clientService'
import type { IFirebaseTeamDetail } from '../types'
import { queryKeysMain } from '@/lib/queryKeys'

const useFetchingTeamsDataInLeague = (leagueId: number) => {
  const teamIdsQuery = useQuery<number[], Error>({
    queryKey: queryKeysMain.teams.idsByLeaguePersisted(leagueId),
    queryFn: async () => fetchTeamIdsInLeague(leagueId),

    enabled: !!leagueId,
  })

  const teamDatasQuery = useQueries({
    queries: (teamIdsQuery.data ?? []).map<
      UseQueryOptions<IFirebaseTeamDetail, Error>
    >(teamId => ({
      queryKey: queryKeysMain.teams.detail(teamId),
      queryFn: () => fetchTeam(teamId),
    })),
  })

  return { teamIdsQuery, teamDatasQuery }
}

export default useFetchingTeamsDataInLeague
