// routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { hasPermission } from '../components/helpers/permissionRoute'
import { useAuth } from '../context/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode
  requiredRoles?: string[] // Roles bắt buộc nếu có
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user } = useAuth()
  // Nếu có truyền requiredRoles → kiểm tra quyền
  const allowed = hasPermission(requiredRoles, user.roles)
  return allowed ? children : <Navigate to='/unauthorized' />
}

export default ProtectedRoute
