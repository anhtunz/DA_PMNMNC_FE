import { Outlet } from 'react-router-dom'
import Header from './partials/Header'
import Sidebar from './partials/Sidebar'
const MainLayout = () => {
  return (
    <div className='flex flex-row'>
      <Sidebar asideClass='w-1/5' />
      <div className='w-4/5'>
        <Header />
        <div className='container'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default MainLayout
