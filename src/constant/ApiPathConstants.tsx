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

  // Quan ly users (ADMIN or SUPERADMIN)
  static readonly ADMIN_BLOCK_OR_UNBLOCK_USER = 'admin/users/block'
  static readonly ADMIN_GET_ALL_USERS = 'admin/users'
  static readonly ADMIN_CREATE_USER = 'admin/create-user'
  static readonly ADMIN_RESET_PASSWORD = 'admin/reset-password'
  static readonly SUPERADMIN_SET_OR_REMOVE_ROLE = 'superadmin/admin-role'
}

export default APIPathConstants
