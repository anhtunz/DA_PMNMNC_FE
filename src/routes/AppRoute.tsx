// routes/AppRouter.tsx
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard/DashBoard'
import NotFound from '../pages/NotFound'
import Unauthorized from '../pages/Unauthorized'
import PublicRoute from './publicRoutes'
import MainLayout from '../layouts/MainLayout'
import WorkshiftStaffPage from '../pages/workshift-staff'
import HistoryWorkshiftStaffPage from '../pages/workshift-staff/HistoryWorkshiftStaff'
import ProtectedRoute from './protectedRoute'
import ProfilePage from '../pages/Profile/index'
import ShiftRegistration from '../pages/ShiftRegistration/ShiftRegistration'
import UsersManager from '../pages/admin/user_manager/UserManager'
import PersonalWorkshift from '../pages/workshift-staff/PersonalWorkshift'
import GetAllShiftsPage from '../pages/ShiftManagement/getAllShifts'
import ForgetPassword from '../pages/Login/ForgetPassword/ForgetPassword'
import ApplicationConstants from '../constant/ApplicationConstant'

// import AddShiftPage from '../pages/ShiftManagement/addshift'
import CreateInvoice from '../pages/invoice/CreateInvoice'

import ServiceManager from '../pages/ServiceManager/ServiceManager'
import GetAllRoomsPage from '../pages/RoomManagement/getAllRooms'
import RoomRentalHistory from '../pages/superadmin/RoomRentalHistory'

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
      { index: true, element: <Navigate to='dashboard' /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'personal-workshift-history', element: <PersonalWorkshift /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'shift-registration', element: <ShiftRegistration /> },
      { path: 'create-invoice', element: <CreateInvoice /> },

      // ADMIN ROUTES
      {
        element: <ProtectedRoute requiredRoles={[ApplicationConstants.ADMIN_ROLE]} />,
        children: [
          { path: 'workshift-staff', element: <WorkshiftStaffPage /> },
          { path: 'staff-workshift-history', element: <HistoryWorkshiftStaffPage /> },
          { path: 'users-manager', element: <UsersManager /> },
          { path: 'list-of-shifts', element: <GetAllShiftsPage /> },
          { path: 'service-manager', element: <ServiceManager /> },
          { path: 'list-of-rooms', element: <GetAllRoomsPage /> }
        ]
      },
      {
        element: <ProtectedRoute requiredRoles={[ApplicationConstants.SUPERADMIN_ROLE]} />,
        children: [{ path: ApplicationConstants.ROOM_HISTORY_PATH, element: <RoomRentalHistory /> }]
      }
    ]
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
