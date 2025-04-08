import { Dropdown, MenuProps, Space } from 'antd'
import { useState } from 'react'
import { SettingOutlined } from '@ant-design/icons'
const UserDropdown = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false)

  function toggleDropdown() {
    setIsOpen(!isOpen)
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: `${user?.email ?? ''}`,
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: 'Profile',
      extra: '⌘P'
    },
    {
      key: '3',
      label: 'Billing',
      extra: '⌘B'
    },
    {
      key: '4',
      label: 'Settings',
      icon: <SettingOutlined />,
      extra: '⌘S'
    }
  ]
  return (
    <div className=''>
      <Dropdown menu={{ items }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <button
            onClick={toggleDropdown}
            className='flex items-center text-gray-700 dropdown-toggle dark:text-gray-400'
          >
            <span className='mr-3 overflow-hidden rounded-full h-11 w-11'>
              <img src={user?.avatar ?? ''} alt='User' sizes='24' />
            </span>

            <span className='block mr-1 font-medium text-theme-sm max-md:hidden'>TunzTunzz</span>
            <svg
              className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 max-md:hidden  ${
                isOpen ? 'rotate-180' : ''
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
