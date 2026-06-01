import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import RootLayout from '@/shared/ui/layout/RootLayout'
import ProtectedRoute from '@/shared/ui/layout/ProtectedRoute'
import { Cover } from '@/pages/cover/Cover'
import routerPath from '@/constant/routerPath'
import { SkeletonBase } from '@/utils/skeletonUI'
import NotFound from '@/pages/not-found/NotFound'

const Submission = lazy(() => import('@/pages/submission/Submission'))

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
              <Suspense
                fallback={<RouteFallback aria-label='퀴즈 화면 로딩' />}
              >
                <Submission />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

const router = createBrowserRouter(routes, {
  basename,
})

export default router
