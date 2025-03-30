// import { ChartBarIcon, ChevronDownIcon } from '@heroicons/react/16/solid'
// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { menuSidebar } from '../../assets/dataset/menuSidebar'
// interface SidebarProps {
//   asideClass?: string
// }

// const Sidebar = ({ asideClass = '' }: SidebarProps) => {
//   const [activeIndex, setActiveIndex] = useState<{ parent: number | null; child: number | null }>(() => {
//     const storedActive = sessionStorage.getItem('activeMenu')
//     return storedActive ? JSON.parse(storedActive) : { parent: null, child: null }
//   })

//   const handleParentMenuClick = (index: number, event: React.MouseEvent<HTMLAnchorElement>) => {
//     const listItem = event.currentTarget.closest('li')
//     const subMenu = listItem?.querySelector('.sub-menu')
//     if (subMenu) {
//       event.preventDefault()
//       setActiveIndex((prevIndex) => {
//         if (prevIndex?.parent === index) {
//           setActiveMenu(null, null) //đóng sub-menu
//           return { parent: null, child: null }
//         }
//         //lưu trạng thái sub-menu mở
//         const newIndex = { parent: index, child: null }
//         return newIndex
//       })
//     } else {
//       setActiveMenu(index, null)
//     }
//   }

//   const setActiveMenu = (parentIndex: number | null, childIndex: number | null) => {
//     const newActive = { parent: parentIndex, child: childIndex }
//     sessionStorage.setItem('activeMenu', JSON.stringify(newActive))
//     setActiveIndex(newActive)
//   }

//   return (
//     <aside
//       className={`sticky top-0 left-0 flex flex-col h-dvh px-3 py-2
//                   font-bold shadow-lg shadow-gray-500/50 text-sm text-gray-600 ${asideClass}`}
//     >
//       <article className='flex flex-col py-4'>
//         <a href='/dashboard' className='flex justify-start gap-3 items-center p-2 font-bold text-lg'>
//           <ChartBarIcon className='size-6' />
//           HỆ THỐNG QUẢN LÝ
//         </a>
//       </article>
//       <section className='flex flex-col'>
//         <span className='text-gray-400 p-2 font-normal'>MENU</span>
//         <ul className='flex flex-col gap-3 '>
//           {menuSidebar.map((sidebar, parentIndex) => (
//             <li key={parentIndex} className={`group`}>
//               <Link
//                 to={sidebar.path}
//                 className={`flex items-center gap-3 p-2 rounded
//                             ${
//                               activeIndex.parent === parentIndex
//                                 ? ' bg-blue-200 text-blue-500'
//                                 : 'group-hover:bg-gray-300'
//                             }
//                           `}
//                 onClick={(event) => {
//                   handleParentMenuClick(parentIndex, event)
//                 }}
//               >
//                 {sidebar.icon}
//                 <span className='w-3/4'>{sidebar.name}</span>
//                 {sidebar.children && (
//                   <ChevronDownIcon
//                     className={`ml-auto size-6 ${activeIndex.parent === parentIndex ? '' : 'rotate-90'}`}
//                   />
//                 )}
//               </Link>
//               {sidebar.children && (
//                 <div
//                   className={`translate transform mt-2 ml-9 sub-menu
//                               ${activeIndex.parent === parentIndex ? 'block' : 'hidden'}`}
//                 >
//                   <ul>
//                     {sidebar.children.map((item, childIndex) => (
//                       <li key={childIndex} className='mt-3 mb-2 '>
//                         <Link
//                           to={item.path}
//                           className={`py-2 px-2 block hover:bg-gray-300 rounded
//                                       ${
//                                         activeIndex.parent === parentIndex && activeIndex.child === childIndex
//                                           ? 'text-blue-500'
//                                           : ''
//                                       }
//                                     `}
//                           onClick={() => setActiveMenu(parentIndex, childIndex)}
//                         >
//                           {item.name}
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </section>
//     </aside>
//   )
// }

// export default Sidebar

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
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
    key: 'sub2',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' }
    ]
  },
  {
    type: 'divider'
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
    <Sider trigger={null} collapsible collapsed={collapsed} className='fixed top-0 left-0 h-screen max-md:hidden'>
      <div className='p-4 pb-2 flex justify-between items-center bg-white'>
        <img src='https://img.logoipsum.com/243.svg ' className={`${!collapsed ? 'w-32' : 'w-0'}`} />
        <img src='https://img.logoipsum.com/245.svg ' className={`${!collapsed ? 'w-0' : 'w-14'}`} />
      </div>
      <Menu
        className='h-screen'
        theme='light'
        mode='inline'
        defaultSelectedKeys={[selectedKey]}
        items={items}
        onClick={onClick}
      />
    </Sider>
  ) : (
    <Drawer title='Basic Drawer' placement='left' closable={false} onClose={onClose} open={isOpenSidebar}>
      <Menu theme='light' mode='inline' defaultSelectedKeys={[selectedKey]} items={items} onClick={onClick} />
    </Drawer>
  )
}
