import useUserStore from '../../stores/userStore'
import loginService from './loginService'

import cookieStorage from '../../components/helpers/cookieHandler'
import ApplicationConstants from '../../constant/ApplicationConstant'
import { toastService } from '../toast/ToastService'
interface InitialProps {
  email: string
  password: string
  setLoading: (state: boolean) => void
  onSuccess: () => void
}
const useLoginHandler = () => {
  const { setUser } = useUserStore()
  const login = async ({ email, password, setLoading, onSuccess }: InitialProps) => {
    setLoading(true)
    try {
      const res = await loginService(email, password)
      const { user, token } = res.data.data
      cookieStorage.setItem(ApplicationConstants.TOKEN, token)
      setUser(user, token)
      toastService.success('Đăng nhập thành công')
      onSuccess()
    } catch (err: any) {
      toastService.error(err.data.message)
    } finally {
      setLoading(false)
    }
  }

  return { login }
}
export default useLoginHandler
