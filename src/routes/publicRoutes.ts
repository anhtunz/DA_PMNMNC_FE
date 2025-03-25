import LoginPage from '../pages/Login'
interface RouteType {
  path: string
  element: React.ComponentType
  requiresAuth: boolean
  layout?: React.ComponentType
}
export const publicRoutes: RouteType[] = [
  {
    path: '/login',
    element: LoginPage,
    requiresAuth: false,
    layout: undefined
  }
]
