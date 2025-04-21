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
import ProfilePage from '../pages/Profile/index'
import ShiftRegistration from '../pages/ShiftRegistration/ShiftRegistration'
import UsersManager from '../pages/admin/user_manager/UserManager'
import PersonalWorkshift from '../pages/workshift-staff/PersonalWorkshift'
import AddShiftPage from '../pages/ShiftManagement/addshift'
import GetAllShiftsPage from '../pages/ShiftManagement/getAllShifts'
import NewLogin from '../pages/New Login/main'
import ForgetPassword from '../pages/Login/ForgetPassword/ForgetPassword'
import ApplicationConstants from '../constant/ApplicationConstant'

const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgetPassword />
      </PublicRoute>
    )
  },
  {
    path: '/',
    element: <MainLayout />,

    // ROUTES DÙNG CHUNG CHO MỌI ROLE SAU KHI LOGIN
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'personal-workshift-history', element: <PersonalWorkshift /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'shift-registration', element: <ShiftRegistration /> },

      // ADMIN ROUTES
      {
        element: <ProtectedRoute requiredRoles={[ApplicationConstants.ADMIN_ROLE]} />,
        children: [
          { path: 'employees', element: <EmployeePage /> },
          { path: 'workshift-staff', element: <WorkshiftStaffPage /> },
          { path: 'staff-workshift-history', element: <HistoryWorkshiftStaffPage /> },
          { path: 'users-manager', element: <UsersManager /> },
          { path: 'add-shift', element: <AddShiftPage /> },
          { path: 'list-of-shifts', element: <GetAllShiftsPage /> }
        ]
      },
    ]
  },
  {
    path: '/new-login',
    element: (
      <PublicRoute>
        <NewLogin />
      </PublicRoute>
    )
  },

  // UNAUTHORIZED AND NOT FOUND ROUTE
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

const AppRouter = () => <RouterProvider router={router} />
export default AppRouter
