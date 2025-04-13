import { ClockCircleOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Drawer, Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]
const items: MenuItem[] = [
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '/employees', label: 'Option 1' },
          { key: '2', label: 'Option 2' }
        ]
      },
      {
        key: 'g2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' }
        ]
      }
    ]
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' }
    ]
  },
  {
    key: 'sub5',
    label: 'Ca làm nhân viên',
    icon: <ClockCircleOutlined />,
    children: [
      { key: '/workshift-staff', label: 'Được đăng ký' },
      { key: '/history-workshift-staff', label: 'Lịch sử ca làm' }
    ]
  },
  {
    key: 'sub6',
    label: 'Quản lý ca làm',
    icon: <ClockCircleOutlined />,
    children: [
      { key: '/add-shift', label: 'Thêm mới ca làm' },
    ]
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
  console.log(selectedKey)
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
