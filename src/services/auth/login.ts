import { NetworkManager } from "../../config/network_manager"
import APIPathConstants from "../../constant/ApiPathConstants"
const Login = async (email: string, password: string) => {
  const data = {
    email,
    password
  }
  try {
    const response = await NetworkManager.instance.createDataInServer(APIPathConstants.LOGIN_PATH, data)
    return response
  } catch (error) {
    console.log(error)
  }
}
export default Login
