import { UsersIcon, BriefcaseIcon, ChartPieIcon } from '@heroicons/react/16/solid'
const menuSidebar = [
  {
    name: 'Quản lý nhân viên',
    path: '/employees',
    icon: <UsersIcon className='size-6' />
  },
  {
    name: 'Quản lý ca làm',
    path: '#',
    icon: <BriefcaseIcon className='size-6' />,
    children: [
      {
        name: 'Ca làm',
        path: '/work-shift'
      },
      {
        name: 'Đơn đăng ký',
        path: '/shift-requests'
      }
    ]
  },
  {
    name: 'Báo cáo chi tiết',
    path: '#',
    icon: <ChartPieIcon className='size-6' />,
    children: [
      {
        name: 'Đặt phòng',
        path: '/report-reservation'
      },
      {
        name: 'Doanh thu',
        path: '/report-revenue'
      }
    ]
  }
]
export { menuSidebar }
