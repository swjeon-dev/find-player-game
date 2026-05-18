import { RouterProvider } from 'react-router-dom'
import router from './router'

const BrowserRouter = () => {
  return <RouterProvider router={router} />
}

export default BrowserRouter
