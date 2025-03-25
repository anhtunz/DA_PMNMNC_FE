import LoginPage from '../pages/Login'
import RegisterPage from '../pages/Register'
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
  },
  {
    path: '/register',
    element: RegisterPage,
    requiresAuth: false,
    layout: undefined
  }
]
