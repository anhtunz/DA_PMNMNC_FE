import { post } from '../../config/axios'
const Login = async (email: string, password: string) => {
  const data = {
    email,
    password
  }
  try {
    const response = await post('auth/login', data)
    return response
  } catch (error) {
    console.log(error)
  }
}
export default Login
