import ApplicationConstants from "../../constant/ApplicationConstant"

const hasPermission = (routeRoles: string[] = [], userRoles: string[] = []): boolean => {
  if (userRoles.includes(ApplicationConstants.SUPERADMIN_ROLE)) return true
  return routeRoles.some((role) => userRoles.includes(role))
}
export { hasPermission }
