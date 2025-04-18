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
    static readonly PERSONAL_HISTORY_WORKSHIFT = '/personal-history-workshift'
}

export default ApplicationConstants
