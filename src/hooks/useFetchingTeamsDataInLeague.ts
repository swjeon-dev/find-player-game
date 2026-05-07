import { useQuery } from '@tanstack/react-query'
import { fetchTeam, fetchTeamIdsInLeague } from '../services/clientService'
import type { IFirebaseTeamDetail } from '../types'

const useFetchingTeamsDataInLeague = (leagueId: number) => {
  const {
    isPending,
    error,
    data: teamsInLeague,
    refetch,
  } = useQuery<IFirebaseTeamDetail[], Error>({
    queryKey: ['teams', 'league', leagueId],
    queryFn: async () => {
      const teamIds = await fetchTeamIdsInLeague(leagueId)

      const promiseArr = teamIds.map(id => fetchTeam(id))
      const teams = await Promise.all(promiseArr)

      return teams.filter(team => team !== null)
    },
  })

  return { isPending, error, teamsInLeague, refetch }
}

export default useFetchingTeamsDataInLeague
