import { Button, theme } from 'antd'
import { Header } from 'antd/es/layout/layout'
import ThemeModeButton from '../../components/common/ThemeModeButton'
import NotificationDropdown from '../../components/common/NotificationDropdown'
import UserDropdown from '../../components/common/UserDropdown'
import { MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import useUserStore from '../../stores/userStore'

const Headers = ({
  expanded,
  collapsed,
  setCollapsed,
  isMd,
  showDrawer
}: {
  expanded: boolean
  collapsed: boolean
  setCollapsed: any
  isMd: boolean
  showDrawer: any
}) => {
  const {
    token: { colorBgContainer }
  } = theme.useToken()
  const { user } = useUserStore()
  return (
    <Header
      className='sticky z-1 w-full py-2 max-h-fit h-20 top-0 bg-white border-gray-600 flex items-center justify-between px-4'
      style={{ paddingLeft: 0, paddingRight: 15, background: colorBgContainer }}
    >
      {!isMd ? (
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64
          }}
        />
      ) : (
        <Button
          type='text'
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64
          }}
        />
      )}

      <h1
        className={`text-2xl font-semibold whitespace-nowrap transition-all duration-300 ${!expanded ? 'absolute left-1/2 -translate-x-1/2' : ''
          }`}
      >
        Good Morning, {user && user.name}!
      </h1>
      {expanded ? (
        <div className='flex items-center gap-5'>
          <ThemeModeButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      ) : (
        <UserDropdown />
      )}
    </Header>
  )
}

export default Headers
