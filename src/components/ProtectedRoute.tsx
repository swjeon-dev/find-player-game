import { useRecoilValue } from 'recoil'
import { Navigate, Outlet } from 'react-router-dom'

import { leagueInfoState } from '@/state'
import routerPath from '@/constant/routerPath'

export default function ProtectedRoute() {
  const leagueInfo = useRecoilValue(leagueInfoState)

  // Vite는 VITE_* 를 `vite build` 시점에 번들에 넣습니다. preview 단계에서 환경변수를 바꿔도 dist 는 그대로입니다.
  if (import.meta.env.VITE_LHCI === 'true') {
    return <Outlet />
  }

  if (!leagueInfo.id) {
    alert('먼저 리그를 선택해주세요.')
    return <Navigate to={routerPath.HOME} replace />
  }
  return <Outlet />
}
