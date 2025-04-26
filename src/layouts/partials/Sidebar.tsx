import { ClockCircleOutlined, PieChartOutlined, TableOutlined, HourglassOutlined } from '@ant-design/icons'
import { Drawer, Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApplicationConstants from '../../constant/ApplicationConstant'

type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  {
    key: ApplicationConstants.DASHBOARD_PATH,
    label: 'Dashboard',
    icon: <PieChartOutlined />,
  },
  {
    key: 'sub1',
    label: 'Quản lý ca làm',
    icon: <ClockCircleOutlined />,
    children: [
      { key: '/history-workshift-staff', label: 'Lịch sử ca làm' },
      { key: '/workshift-staff', label: 'Duyệt ca làm' }
    ]
  },
  {
    key: '/shift-registration',
    label: 'Đăng ký ca làm',
    icon: <ClockCircleOutlined />
  },
  {
    key: '/list-of-shifts',
    label: 'Danh sách ca làm',
    icon: <HourglassOutlined />
  },
  {
    key: 'list-of-rooms',
    label: 'Danh sách phòng',
    icon: <TableOutlined />
  },
  {
    key: `/${ApplicationConstants.USERS_MANAGER_PATH}`,
    label: ApplicationConstants.USERS_MANAGER_PATH_NAME,
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='w-4 h-4'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
        />
      </svg>
    )
  }
]

export default function Sidebar({
  collapsed,
  isMd,
  isOpenSidebar,
  setIsOpenSidebar
}: {
  collapsed?: boolean
  isMd?: boolean
  isOpenSidebar?: boolean
  setIsOpenSidebar?: any
}) {
  const [selectedKey, setSelectedKey] = useState('/employees')
  const setDefaultKey = (key: string) => {
    setSelectedKey(key ?? '')
  }
  const onClose = () => {
    setIsOpenSidebar(false)
  }
  const navigate = useNavigate()
  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`${e.key}`)
    setDefaultKey(`${e.key}`)
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
          defaultSelectedKeys={[selectedKey]}
          items={items}
          onClick={onClick}
        />
      </Sider>
    </div>
  ) : (
    <Drawer title='Basic Drawer' placement='left' closable={false} onClose={onClose} open={isOpenSidebar}>
      <Menu theme='light' mode='inline' defaultSelectedKeys={[selectedKey]} items={items} onClick={onClick} />
    </Drawer>
  )
}
