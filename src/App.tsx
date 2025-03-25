import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import routesConfig from './routes'
import NotFound from './pages/NotFound'
import { useSelector } from 'react-redux'
import { RootState } from './stores'
function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const routes = createBrowserRouter([
    ...routesConfig.map((route) => ({
      path: route.path,
      element:
        route.requiresAuth && !isAuthenticated ? (
          <Navigate to='/login' replace />
        ) : route.layout ? (
          <route.layout />
        ) : (
          <route.element />
        ),
      children: route.layout ? [{ index: true, element: <route.element /> }] : undefined
    })),
    {
      path: '*',
      element: <NotFound />
    }
  ])
  return <RouterProvider router={routes} />
}

export default App
