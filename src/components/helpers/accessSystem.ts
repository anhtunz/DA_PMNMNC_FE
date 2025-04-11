interface Route {
  role?: string | string[];
}

const canAccess = (route: Route, userRole: string) => {
  if (!route?.role) return true;
  const roles = Array.isArray(route.role) ? route.role : [route.role];
  return roles.includes(userRole);
};
export default canAccess;