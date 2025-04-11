import useUserStore from '../../stores/userStore'
import loginService from './LoginService'
import cookieStorage from '../../components/helpers/cookieHandler'
import ApplicationConstants from '../../constant/ApplicationConstant'
import StatusCodeConstants from '../../constant/StatusCodeConstants'
import { ToastSuccess, ToastError } from '../../components/common/ToastMessage'

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
      if (res.status === StatusCodeConstants.OK) {
        const { user, token } = res.data.data
        cookieStorage.setItem(ApplicationConstants.TOKEN, token)
        setUser(user, token)
        ToastSuccess('Đăng nhập thành công')
        onSuccess()
      } else {
        ToastSuccess(res.data.message)
      }
    } catch (err) {
      ToastError('Hệ thống gặp sự cố!')
    } finally {
      setLoading(false)
    }
  }

  return { login }
}
export default useLoginHandler
