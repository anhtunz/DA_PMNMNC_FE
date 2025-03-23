import LoginPage from '../pages/Login'
interface RouteType {
  path: string
  element: React.ComponentType
  layout?: React.ComponentType
}
export const publicRoutes: RouteType[] = [
  {
    path: '/login',
    element: LoginPage,
    layout: undefined
  }
]
