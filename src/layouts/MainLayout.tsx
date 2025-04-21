import { Layout, Spin } from 'antd'
import { Navigate, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Sidebar from './partials/Sidebar'
import Headers from './partials/Header'
import { useAuth } from '../context/AuthContext'
import { LoadingOutlined } from '@ant-design/icons'
const { Content } = Layout
const MainLayout = () => {
  const [expanded, setExpanded] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMd, setIsMd] = useState(false)
  const { isAuthenticated, authChecked } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false)
        setCollapsed(true)
      } else {
        setExpanded(true)
        setCollapsed(false)
      }
      if (window.innerWidth < 768) {
        setIsMd(true)
      } else {
        setIsMd(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!authChecked) return <Spin fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  if (!isAuthenticated) return <Navigate to='/login' replace />

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <Layout className='flex w-full h-full'>
      <Sidebar collapsed={collapsed} isMd={isMd} isOpenSidebar={open} setIsOpenSidebar={onClose} />
      <Layout>
        <Headers
          showDrawer={showDrawer}
          expanded={expanded}
          isMd={isMd}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <Content className='flex-grow p-4 bg-gray-100 h-0 min-h-0 overflow-y-auto max-md:h-full'>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
export default MainLayout
