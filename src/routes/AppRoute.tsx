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
import ShiftRegistration from '../pages/ShiftRegistration/ShiftRegistration'
import UsersManager from '../pages/admin/user_manager/UserManager'
import PersonalWorkshift from '../pages/workshift-staff/PersonalWorkshift'
import AddShiftPage from '../pages/ShiftManagement/addshift'
import GetAllShiftsPage from '../pages/ShiftManagement/getAllShifts'
import NewLogin from '../pages/New Login/main'
import ForgetPassword from '../pages/Login/ForgetPassword/ForgetPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout />
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
        path: ApplicationConstants.PERSONAL_HISTORY_WORKSHIFT,
        element: <PersonalWorkshift />
      },
      {
        path: 'profile',
        element: <ProfilePage /> // Assuming you have a ProfilePage component
      },
      {
        path: 'shift-registration',
        element: <ProtectedRoute requiredRoles={[ApplicationConstants.ADMIN_ROLE]}><ShiftRegistration /></ProtectedRoute> // Assuming you have a ShiftRegistration component
      },
      {
        path: ApplicationConstants.USERS_MANAGER_PATH,
        element: <UsersManager />
      },
      {
        path: 'list-of-shifts',
        element: <GetAllShiftsPage />
      }
    ]
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/new-login',
    element: (
      <PublicRoute>
        <NewLogin />
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
