import { useQuery } from '@tanstack/react-query'
import { fetchTeam } from '../services/clientService'
import type { IFirebaseTeamDetail } from '../types'
import { queryKeysMain } from '@/lib/queryKeys'

// 단일 팀 정보 조회
const useFetchingTeamData = (teamId: number) => {
  const {
    isPending,
    error,
    data: team,
  } = useQuery<IFirebaseTeamDetail, Error>({
    queryKey: queryKeysMain.teams.detail(teamId),
    queryFn: () => fetchTeam(teamId),
  })

  return { isPending, error, team }
}

export default useFetchingTeamData
