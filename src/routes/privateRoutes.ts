import MainLayout from '../layouts/MainLayout'
import DashBoardPage from '../pages/Dashboard'
import HomePage from '../pages/Home/HomePage'
interface RouteType {
  path: string
  element: React.ComponentType
  layout?: React.ComponentType
}
export const privateRoutes: RouteType[] = [
  {
    path: '/dashboard',
    element: DashBoardPage,
    layout: MainLayout
  },
  {
    path: '/',
    element: HomePage,
    layout: MainLayout
  }
]
