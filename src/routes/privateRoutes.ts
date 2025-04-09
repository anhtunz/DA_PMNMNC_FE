import MainLayout from '../layouts/MainLayout'
import DashBoardPage from '../pages/Dashboard'
import EmployeePage from '../pages/Employees/EmployeePage'
import HomePage from '../pages/Home/HomePage'
import ProfilePage from '../pages/Profile'
import WorkshiftStaffPage from '../pages/workshift-staff'
import HistoryWorkshiftStaffPage from '../pages/workshift-staff/HistoryWorkshiftStaff'
interface RouteType {
  path: string
  element: React.ComponentType
  requiresAuth: boolean
  layout?: React.ComponentType
}
export const privateRoutes: RouteType[] = [
  {
    path: '/dashboard',
    element: DashBoardPage,
    requiresAuth: true,
    layout: MainLayout
  },
  {
    path: '/',
    element: HomePage,
    requiresAuth: true,
    layout: MainLayout
  },
  {
    path: '/employees',
    element: EmployeePage,
    requiresAuth: true,
    layout: MainLayout
  },
  {
    path: '/workshift-staff',
    element: WorkshiftStaffPage,
    requiresAuth: true,
    layout: MainLayout
  },
  {
    path: '/history-workshift-staff',
    element: HistoryWorkshiftStaffPage,
    requiresAuth: true,
    layout: MainLayout
  },
  {
    path: '/profile',
    element: ProfilePage,
    requiresAuth: true,
    layout: MainLayout
  }
]
