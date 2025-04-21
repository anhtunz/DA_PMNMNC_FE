// routes/PublicRoute.tsx
import { JSX } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, authChecked } = useAuth()

  if (!authChecked) return <Spin fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return children
}

export default PublicRoute
