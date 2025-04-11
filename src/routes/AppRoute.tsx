// routes/AppRouter.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import Unauthorized from '../pages/Unauthorized'
import PublicRoute from './publicRoutes'
import MainLayout from '../layouts/MainLayout'
import EmployeePage from '../pages/Employees/EmployeePage'
import WorkshiftStaffPage from '../pages/workshift-staff'
import HistoryWorkshiftStaffPage from '../pages/workshift-staff/HistoryWorkshiftStaff'
import ProtectedRoute from './protectedRoute'
import ApplicationConstants from '../constant/ApplicationConstant'
import ProfilePage from '../pages/Profile/index'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute requiredRoles={[ApplicationConstants.ADMIN_ROLE]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'employees',
        element: <EmployeePage />
      },
      {
        path: 'workshift-staff',
        element: <WorkshiftStaffPage />
      },
      {
        path: 'history-workshift-staff',
        element: <HistoryWorkshiftStaffPage />
      },
      {
        path: 'profile',
        element: <ProfilePage /> // Assuming you have a ProfilePage component
      }
    ]
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

const AppRouter = () => <RouterProvider router={router} />
export default AppRouter
