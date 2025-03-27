import { ChartBarIcon, ChevronDownIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { menuSidebar } from '../../assets/dataset/menuSidebar'
interface SidebarProps {
  asideClass?: string
}

const Sidebar = ({ asideClass = '' }: SidebarProps) => {
  const [activeIndex, setActiveIndex] = useState<{ parent: number | null; child: number | null }>(() => {
    const storedActive = sessionStorage.getItem('activeMenu')
    return storedActive ? JSON.parse(storedActive) : { parent: null, child: null }
  })

  const handleParentMenuClick = (index: number, event: React.MouseEvent<HTMLAnchorElement>) => {
    const listItem = event.currentTarget.closest('li')
    const subMenu = listItem?.querySelector('.sub-menu')
    if (subMenu) {
      event.preventDefault()
      setActiveIndex((prevIndex) => {
        if (prevIndex?.parent === index) {
          setActiveMenu(null, null) //đóng sub-menu
          return { parent: null, child: null }
        }
        //lưu trạng thái sub-menu mở
        const newIndex = { parent: index, child: null }
        return newIndex
      })
    } else {
      setActiveMenu(index, null)
    }
  }

  const setActiveMenu = (parentIndex: number | null, childIndex: number | null) => {
    const newActive = { parent: parentIndex, child: childIndex }
    sessionStorage.setItem('activeMenu', JSON.stringify(newActive))
    setActiveIndex(newActive)
  }

  return (
    <aside
      className={`sticky top-0 left-0 flex flex-col h-dvh px-3 py-2
                  font-bold shadow-lg shadow-gray-500/50 text-sm text-gray-600 ${asideClass}`}
    >
      <article className='flex flex-col py-4'>
        <a href='/dashboard' className='flex justify-start gap-3 items-center p-2 font-bold text-lg'>
          <ChartBarIcon className='size-6' />
          HỆ THỐNG QUẢN LÝ
        </a>
      </article>
      <section className='flex flex-col'>
        <span className='text-gray-400 p-2 font-normal'>MENU</span>
        <ul className='flex flex-col gap-3 '>
          {menuSidebar.map((sidebar, parentIndex) => (
            <li key={parentIndex} className={`group`}>
              <Link
                to={sidebar.path}
                className={`flex items-center gap-3 p-2 rounded 
                            ${
                              activeIndex.parent === parentIndex
                                ? ' bg-blue-200 text-blue-500'
                                : 'group-hover:bg-gray-300'
                            }
                          `}
                onClick={(event) => {
                  handleParentMenuClick(parentIndex, event)
                }}
              >
                {sidebar.icon}
                <span className='w-3/4'>{sidebar.name}</span>
                {sidebar.children && (
                  <ChevronDownIcon
                    className={`ml-auto size-6 ${activeIndex.parent === parentIndex ? '' : 'rotate-90'}`}
                  />
                )}
              </Link>
              {sidebar.children && (
                <div
                  className={`translate transform mt-2 ml-9 sub-menu 
                              ${activeIndex.parent === parentIndex ? 'block' : 'hidden'}`}
                >
                  <ul>
                    {sidebar.children.map((item, childIndex) => (
                      <li key={childIndex} className='mt-3 mb-2 '>
                        <Link
                          to={item.path}
                          className={`py-2 px-2 block hover:bg-gray-300 rounded 
                                      ${
                                        activeIndex.parent === parentIndex && activeIndex.child === childIndex
                                          ? 'text-blue-500'
                                          : ''
                                      }
                                    `}
                          onClick={() => setActiveMenu(parentIndex, childIndex)}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default Sidebar
