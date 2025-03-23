import { privateRoutes } from './privateRoutes'
import { publicRoutes } from './publicRoutes'

const routesConfig = [...publicRoutes, ...privateRoutes]
export default routesConfig
