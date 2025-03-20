import { Outlet } from 'react-router-dom'
import Header from './layouts/partials/Header'
import Footer from './layouts/partials/Footer'
function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
