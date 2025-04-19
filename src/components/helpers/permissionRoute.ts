import ApplicationConstants from "../../constant/ApplicationConstant"

const hasPermission = (routeRoles: string[] = [], userRoles: string[] = []): boolean => {
  if (routeRoles.length === 0) return true
  if (userRoles.includes(ApplicationConstants.SUPERADMIN_ROLE)) return true
  return routeRoles.some((role) => userRoles.includes(role))
}
export { hasPermission }
