import { Dropdown, MenuProps, Modal } from 'antd'
import { useState } from 'react'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import useUserStore from '../../stores/userStore'
import { useNavigate } from 'react-router-dom'
const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  function toggleDropdown() {
    setIsOpen(!isOpen)
  }
  const handleMenuClick = (key: string) => {
    if (key === '2') {
      navigate('/profile')
    }
  }
  const handleLougout = () => {
    Modal.confirm({
      title: 'Thông báo',
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk: () => {
        logout()
        navigate('/login', { replace: true })
      }
    });
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: `${user && user.email || 'Not updated'}`,
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: 'Trang cá nhân',
      icon: <UserOutlined />,
      onClick: () => handleMenuClick('2')
    },
    {
      key: '3',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLougout

    },
  ]
  return (
    <div className=''>
      <Dropdown menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <button
            onClick={toggleDropdown}
            className='flex items-center text-gray-700 dropdown-toggle dark:text-gray-400'
          >
            <span className='mr-3 flex items-center overflow-hidden rounded-full h-11 w-11'>
              <img className='object-cover' src={user?.avatar || 'https://ui-avatars.com/api/?background=0D8ABC&color=fff'} alt='User' />
            </span>

            <span className='block mr-1 font-medium text-theme-sm max-md:hidden'>{user && user.name}</span>
            <svg
              className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 max-md:hidden  ${isOpen ? 'rotate-180' : ''
                }`}
              width='18'
              height='20'
              viewBox='0 0 18 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.3125 8.65625L9 13.3437L13.6875 8.65625'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </a>
      </Dropdown>
    </div>
  )
}

export default UserDropdown
