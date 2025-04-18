class APIPathConstants {
  static readonly LOGIN_PATH = 'auth/login'
  static readonly TEST_PATH = 'auth/test'
  static readonly REFRESH_TOKEN_PATH = 'auth/refresh-token'
  //quan ly thong tin user
  static readonly GET_USER_INFO = 'user-info/get-info'
  static readonly UPDATE_AVATAR = 'user-info/update-avatar'
  static readonly UPDATE_USER_INFO = 'user-info/update-user-info'
  static readonly CHANGE_PASSWORD = 'user-info/change-password'

  //quản lý ca làm
  static readonly GET_USER_SHIFT_HISTORY = 'user-shift-history/get-all'

  // Quan ly users (ADMIN or SUPERADMIN)
  static readonly ADMIN_BLOCK_OR_UNBLOCK_USER = 'admin/users/block'
  static readonly ADMIN_GET_ALL_USERS = 'admin/users'
}

export default APIPathConstants
