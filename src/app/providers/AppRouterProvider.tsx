import { RouterProvider } from 'react-router-dom'
import appRouter from '@/app/routes/AppRouter'

const AppRouterProvider = () => {
  return <RouterProvider router={appRouter} />
}

export default AppRouterProvider
