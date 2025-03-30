import { useState } from 'react'

const NotificationDropdown = () => {
  const [notifying, setNotifying] = useState(true)
  const handleClick = () => {
    setNotifying(false)
  }
  return (
    <div className='relative'>
      <button
        className='relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100'
        onClick={handleClick}
      >
        <span
          className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? 'hidden' : 'flex'
          }`}
        >
          <span className='absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping'></span>
        </span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
          />
        </svg>
      </button>
    </div>
  )
}

export default NotificationDropdown
