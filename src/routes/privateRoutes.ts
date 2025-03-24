import MainLayout from '../layouts/MainLayout'
import DashBoardPage from '../pages/Dashboard'
import HomePage from '../pages/Home/HomePage'
interface RouteType {
  path: string
  element: React.ComponentType
  requiresAuth: boolean
  layout?: React.ComponentType
}
export const privateRoutes: RouteType[] = [
  {
    path: '/dashboard',
    element: DashBoardPage,
    requiresAuth: true,
    layout: MainLayout
  },
  {
    path: '/',
    element: HomePage,
    requiresAuth: true,
    layout: MainLayout
  }
]
