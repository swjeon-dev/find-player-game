import { useRecoilValue } from 'recoil'
import { Navigate, Outlet } from 'react-router-dom'

import { leagueInfoState } from '@/state'
import routerPath from '@/constant/routerPath'

export default function ProtectedRoute() {
  const leagueInfo = useRecoilValue(leagueInfoState)

  if (!leagueInfo.id) {
    alert('먼저 리그를 선택해주세요.')
    return <Navigate to={routerPath.HOME} replace />
  }
  return <Outlet />
}
