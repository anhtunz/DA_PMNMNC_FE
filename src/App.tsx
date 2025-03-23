import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import routesConfig from './routes'
import NotFound from './pages/NotFound'

function App() {
  const routes = createBrowserRouter([
    ...routesConfig.map((route) => ({
      path: route.path,
      element: route.layout ? <route.layout /> : undefined,
      children: [{ index: true, element: <route.element /> }]
    })),
    {
      path: '*', // ✅ Thêm route 404 vào trong mảng
      element: <NotFound />
    }
  ])

  return <RouterProvider router={routes} />
}

export default App
