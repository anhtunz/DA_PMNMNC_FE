// routes/AppRouter.tsx
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
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
import GetAllShiftsPage from '../pages/ShiftManagement/getAllShifts'
import AddShiftPage from '../pages/ShiftManagement/addshift'
import NewLogin from '../pages/New Login/main'
import ForgetPassword from '../pages/Login/ForgetPassword/ForgetPassword'
import ApplicationConstants from '../constant/ApplicationConstant'
import ServiceManager from '../pages/ServiceManager/ServiceManager'
import GetAllRoomsPage from '../pages/RoomManagement/getAllRooms'

const router = createBrowserRouter([
  // PUBLIC ROUTES
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
      },
      {
        path: 'list-of-rooms',
        element: <GetAllRoomsPage />
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
      { index: true, element: <Navigate to='dashboard' /> },
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
          { path: 'list-of-shifts', element: <GetAllShiftsPage /> },
          { path: 'service-manager', element: <ServiceManager /> }
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
