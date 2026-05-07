import { createBrowserRouter } from 'react-router-dom'
import Submission from '../pages/Submission'
import RootLayout from '../components/layout/RootLayout'
import routerPath from '../constant/routerPath'
import { Cover } from '@/pages/Cover'
import ProtectedRoute from '@/components/ProtectedRoute'

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
            element: <Submission />,
          },
        ],
      },
    ],
  },
]

const router = createBrowserRouter(routes, { basename: '/find-player-game' })

export default router
