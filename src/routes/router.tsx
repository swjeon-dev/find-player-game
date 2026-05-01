import { createBrowserRouter } from 'react-router-dom'
import Submission from '../pages/Submission'
import RootLayout from '../components/layout/RootLayout'
import routerPath from '../constant/routerPath'
import coverLoader from './coverLoader'
import { Cover, RazyCover } from '@/pages/Cover'

const routes = [
  {
    path: routerPath.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Cover />,
        loader: coverLoader,
        HydrateFallback: () => <RazyCover />,
      },
      {
        path: routerPath.SUBMISSION,
        element: <Submission />,
      },
    ],
  },
]

const router = createBrowserRouter(routes, { basename: '/find-player-game' })

export default router
