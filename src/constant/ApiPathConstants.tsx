class APIPathConstants {
  static readonly LOGIN_PATH = 'auth/login'
  static readonly TEST_PATH = 'auth/test'
  static readonly REFRESH_TOKEN_PATH = 'auth/refresh-token'
  static readonly FORGOT_PASSWORD_PATH = 'auth/forgot-password'
  static readonly REFRESH_PASS_PATH = 'auth/refresh-password'
  //quan ly thong tin user
  static readonly GET_USER_INFO = 'user-info/get-info'
  static readonly UPDATE_AVATAR = 'user-info/update-avatar'
  static readonly UPDATE_USER_INFO = 'user-info/update-user-info'
  static readonly CHANGE_PASSWORD = 'user-info/change-password'

  //quản lý ca làm
  static readonly GET_USER_SHIFT_HISTORY = 'user-shift-history/get-all'
  static readonly GET_ALL_STAFF_SHIFT_HISTORY = 'user-shift-management/get-all'

  // Quan ly users (ADMIN or SUPERADMIN)
  static readonly ADMIN_BLOCK_OR_UNBLOCK_USER = 'admin/users/block'
  static readonly ADMIN_GET_ALL_USERS = 'admin/users'
  static readonly ADMIN_CREATE_USER = 'admin/create-user'
  static readonly ADMIN_RESET_PASSWORD = 'admin/reset-password'
  static readonly SUPERADMIN_SET_OR_REMOVE_ROLE = 'superadmin/admin-role'

  //đanh ki ca lam
  static readonly ADMIN_GET_ALL_SHiFTS = 'admin/shifts'
  static readonly GET_USER_SHIFTS = 'user-register-shift/get-all-shift'
  static readonly USER_REGISTER_SHIFT = 'user-register-shift/subscribe-or-unsubscribe-shift'
  static readonly GET_ALL_USER_REGISTERED_SHIFTS = 'user-register-shift/get-all-user-shift'

  // Quản lý ca làm việc
  static readonly GET_ALL_USER_SHIFTS = 'consider-user-shift/get-all'
  static readonly ACCEPT_USER_SHIFT = 'consider-user-shift/accept-user-shift'
  static readonly DENY_USER_SHIFT = 'consider-user-shift/deny-user-shift'

   // Quản lý danh mục
   static readonly CATEGORY_LIST = 'category'
   static readonly ADMIN_CREATE_CATEGORY = 'admin/category/create'
   static readonly ADMIN_UPDATE_CATEGORY = 'admin/category'
   static readonly ADMIN_DELETE_CATEGORY = 'admin/category'
}

export default APIPathConstants
