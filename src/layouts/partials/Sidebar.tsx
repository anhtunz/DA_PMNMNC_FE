import {
  ClockCircleOutlined,
  EditOutlined,
  FileAddOutlined,
  HomeOutlined,
  SolutionOutlined} from '@ant-design/icons'
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
      label: 'Trang chủ',
      icon: <HomeOutlined />
    }
  ]

  const location = useLocation()
  const navigate = useNavigate()
  const matchKey =
    items.flatMap((item: any) => item?.children || [item]).find((i: any) => location.pathname.startsWith(i.key))?.key ||
    ''

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
  if (isEmployee && isAdmin) {
    items.push(
      {
        key: ApplicationConstants.CREATE_INVOICE_PATH,
        label: 'Thêm mới hóa đơn',
        icon: <FileAddOutlined />
      },
      {
        key: ApplicationConstants.PERSONAL_WORKSHIFT_HISTORY_PATH,
        label: 'Lịch sử làm việc',
        icon: <ClockCircleOutlined />
      },
      {
        key: ApplicationConstants.SHIFT_REGISTRATION_PATH,
        label: 'Đăng ký ca làm',
        icon: <EditOutlined />
      }
    )
  }
  if (isAdmin) {
    items.push(
      {
        key: ApplicationConstants.STAFF_WORKSHIFT_HISTORY_PATH,
        label: 'Lịch sử ca làm việc',
        icon: <ClockCircleOutlined />
      },
      {
        key: 'sub2',
        label: 'Quản lý ca làm',
        icon: <SolutionOutlined />,
        children: [
          { key: '/list-of-shifts', label: 'Danh sách ca làm' },
          { key: '/workshift-staff', label: 'Duyệt ca làm' }
        ]
      },
      {
        key: '/list-of-rooms',
        label: 'Quản lý phòng',
        icon: (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819'
            />
          </svg>
        )
      },
      {
        key: '/service-manager',
        label: 'Quản lý dịch vụ',
        icon: (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z'
            />
          </svg>
        )
      },

      {
        key: ApplicationConstants.USERS_MANAGER_PATH,
        label: ApplicationConstants.USERS_MANAGER_PATH_NAME,
        icon: (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='w-4 h-4'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
            />
          </svg>
        )
      }
    )
  }

  return !isMd ? (
    <div className='h-dvh bg-white overflow-auto '>
      <Sider trigger={null} collapsible collapsed={collapsed} className='fixed top-0 left-0  max-md:hidden'>
        <div className='p-4 pb-2 flex justify-between items-center bg-white'>
          <img
            src='https://res.cloudinary.com/dkeclpsjq/image/upload/v1746891268/DAPMNM/logoipsum-369_hkvytu.svg'
            className={`${!collapsed ? 'w-32' : 'w-0'}`}
          />
          <img
            src='https://res.cloudinary.com/dkeclpsjq/image/upload/v1746891347/DAPMNM/logoipsum-370_rssaf5.svg'
            className={`${!collapsed ? 'w-0' : 'w-14'}`}
          />
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
      <Menu
        theme='light'
        mode='inline'
        defaultSelectedKeys={[selectedKey]}
        selectedKeys={[location.pathname]}
        items={items}
        onClick={onClick}
      />
    </Drawer>
  )
}
