import { ClockCircleOutlined, HomeFilled, PieChartOutlined, UserOutlined } from '@ant-design/icons'
import { Drawer, Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ApplicationConstants from '../../constant/ApplicationConstant'
import { useAuth } from '../../context/AuthContext'

type MenuItem = Required<MenuProps>['items'][number]

interface InitialProps {
  collapsed?: boolean
  isMd?: boolean
  isOpenSidebar?: boolean
  setIsOpenSidebar?: any
}
export default function Sidebar({ collapsed, isMd, isOpenSidebar, setIsOpenSidebar }: InitialProps) {
  const items: MenuItem[] = [
    {
      key: ApplicationConstants.DASHBOARD_PATH,
      label: 'Dashboard',
      icon: <PieChartOutlined />
    }
  ]

  const location = useLocation()
  const navigate = useNavigate()
  const matchKey = items
    .flatMap((item: any) => item?.children || [item])
    .find((i: any) => location.pathname.startsWith(i.key))?.key || '';

  const [selectedKey, setSelectedKey] = useState(matchKey)

  const setDefaultKey = (key: string) => {
    setSelectedKey(key ?? '')
  }

  const onClose = () => {
    setIsOpenSidebar(false)
  }

  const onClick: MenuProps['onClick'] = (e) => {
    setDefaultKey(e.key)
    navigate(e.key)
  }

  const { user } = useAuth()
  const roles = user?.roles || []
  const isAdmin = ['ADMIN', 'SUPERADMIN'].some((role) => roles.includes(role))
  const isEmployee = roles.includes('EMPLOYEE')
  if (isEmployee && !isAdmin) {
    items.push(
      {
        key: ApplicationConstants.PERSONAL_WORKSHIFT_HISTORY_PATH,
        label: 'Lịch sử đi làm',
        icon: <ClockCircleOutlined />
      },
      {
        key: ApplicationConstants.SHIFT_REGISTRATION_PATH,
        label: 'Đăng ký ca làm',
        icon: <ClockCircleOutlined />
      }
    )
  }
  if (isAdmin) {
    items.push(
      {
        key: 'sub1',
        label: 'Lịch sử đi làm',
        icon: <ClockCircleOutlined />,
        children: [
          { key: ApplicationConstants.STAFF_WORKSHIFT_HISTORY_PATH, label: 'Nhân viên' },
          { key: ApplicationConstants.PERSONAL_WORKSHIFT_HISTORY_PATH, label: 'Cá nhân' },
        ]
      },
      {
        key: 'sub2',
        label: 'Quản lý ca làm',
        icon: <ClockCircleOutlined />,
        children: [
          { key: '/list-of-shifts', label: 'Danh sách ca làm' },
          { key: '/workshift-staff', label: 'Duyệt ca làm' },
        ]
      },
      {
        key: '/list-of-rooms',
        label: 'Quản lý phòng',
        icon: < HomeFilled/>
      },
      {
        key: '/service-manager',
        label: 'Quản lý dịch vụ',
        icon: <ClockCircleOutlined />
      },
      
      {
        key: ApplicationConstants.USERS_MANAGER_PATH,
        label: ApplicationConstants.USERS_MANAGER_PATH_NAME,
        icon: <UserOutlined />
      }
    )
  }

  return !isMd ? (
    <div className='h-dvh bg-white overflow-auto '>
      <Sider trigger={null} collapsible collapsed={collapsed} className='fixed top-0 left-0  max-md:hidden'>
        <div className='p-4 pb-2 flex justify-between items-center bg-white'>
          <img src='https://img.logoipsum.com/243.svg ' className={`${!collapsed ? 'w-32' : 'w-0'}`} />
          <img src='https://img.logoipsum.com/245.svg ' className={`${!collapsed ? 'w-0' : 'w-14'}`} />
        </div>
        <Menu
          className=''
          theme='light'
          mode='inline'
          selectedKeys={[location.pathname]}
          items={items}
          onClick={onClick}
        />
      </Sider>
    </div>
  ) : (
    <Drawer title='Basic Drawer' placement='left' closable={false} onClose={onClose} open={isOpenSidebar}>
      <Menu theme='light' mode='inline' defaultSelectedKeys={[selectedKey]} selectedKeys={[location.pathname]} items={items} onClick={onClick} />
    </Drawer>
  )
}
