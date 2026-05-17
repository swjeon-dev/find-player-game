import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import RootLayout from '@/components/layout/RootLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Cover } from '@/pages/Cover'
import routerPath from '@/constant/routerPath'
import { SkeletonBase } from '@/utils/skeletonUI'

const Submission = lazy(() => import('@/pages/Submission'))

const RouteFallback = styled(SkeletonBase)`
  width: 100%;
  min-height: 240px;
  border-radius: 12px;
  margin: 24px 0;
`

const routes = [
  {
    path: routerPath.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Cover />,
      },
      {
        path: routerPath.SUBMISSION,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<RouteFallback aria-label='퀴즈 화면 로딩' />}>
                <Submission />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]

const router = createBrowserRouter(routes, { basename: '/find-player-game' })

export default router
