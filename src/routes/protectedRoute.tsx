import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasPermission } from '../components/helpers/permissionRoute'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

type Props = {
  requiredRoles?: string[]
}

const ProtectedRoute = ({ requiredRoles = [] }: Props) => {
  const { user, authChecked } = useAuth()

  if (!authChecked) return <Spin fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />

  const allowed = hasPermission(requiredRoles, user.roles)

  return allowed ? <Outlet /> : <Navigate to="/unauthorized" replace />
}

export default ProtectedRoute
