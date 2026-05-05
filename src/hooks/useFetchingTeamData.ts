import { useQuery } from '@tanstack/react-query'
import { fetchTeam } from '../services/clientService'
import type { IFirebaseTeamDetail } from '../types'

// 단일 팀 정보 조회
const useFetchingTeamData = (teamId: number) => {
  const queryKeys = [teamId, 'total', 'team'] as const
  const {
    isPending,
    error,
    data: team,
  } = useQuery<IFirebaseTeamDetail, Error>({
    queryKey: queryKeys,
    queryFn: () => fetchTeam(teamId),
  })

  return { isPending, error, team }
}

export default useFetchingTeamData
