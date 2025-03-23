import { Outlet } from 'react-router-dom'
import Header from './partials/Header'
import Footer from './partials/Footer'
const MainLayout = () => {
  return (
    <div className='container'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
export default MainLayout
