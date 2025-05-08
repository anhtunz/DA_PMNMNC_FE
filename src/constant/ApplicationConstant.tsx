class ApplicationConstants {
  static readonly DOMAIN = 'http://127.0.0.1:8000/api'
  static readonly TOKEN = 'access_token'

  // config role
  static readonly SUPERADMIN_ROLE = 'SUPERADMIN'
  static readonly ADMIN_ROLE = 'ADMIN'
  static readonly EMPLOYEE_ROLE = 'EMPLOYEE'

  // Web Path
  static readonly USERS_MANAGER_PATH = 'users-manager'
  static readonly USERS_MANAGER_PATH_NAME = 'Quản lý người dùng'
  static readonly DASHBOARD_PATH = '/dashboard'
  static readonly STAFF_WORKSHIFT_HISTORY_PATH = '/staff-workshift-history'
  static readonly PERSONAL_WORKSHIFT_HISTORY_PATH = '/personal-workshift-history'
  static readonly SHIFT_REGISTRATION_PATH = '/shift-registration'
  static readonly CREATE_INVOICE_PATH = '/create-invoice'

  //Web Path - Auth
  static readonly FORGOT_PASSWORD_PATH = '/forgot-password'
  static readonly REGISTER_PATH = '/register'
}

export default ApplicationConstants
