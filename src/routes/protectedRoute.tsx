// routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { hasPermission } from '../components/helpers/permissionRoute'
import { useAuth } from '../context/AuthContext'
import { Flex, Spin } from 'antd'

type ProtectedRouteProps = {
  children: ReactNode
  requiredRoles?: string[] // Roles bắt buộc nếu có
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) return (
    <Spin size="large" fullscreen />
  )

  // Nếu chưa đăng nhập → chuyển hướng về login
  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />
  }

  // Nếu có truyền requiredRoles → kiểm tra quyền
  const allowed = hasPermission(requiredRoles, user.roles)
  return allowed ? children : <Navigate to='/unauthorized' />
}

export default ProtectedRoute
