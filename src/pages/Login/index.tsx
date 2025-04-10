import { useState } from 'react'
import { Form, FormProps, Input } from 'antd'
import Login from '../../services/auth/login'
import useUserStore from '../../stores/userStore'
import LoadingButton from '../../components/common/LoadingButton'
import ToastMessage from '../../components/common/ToastMessage'
import cookieStorage from '../../components/helpers/cookieHandler'
import { useNavigate } from 'react-router-dom'
import ApplicationConstants from '../../constant/ApplicationConstant'
import StatusCodeConstants from '../../constant/StatusCodeConstants'
type FieldType = {
  email?: string
  password?: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  //Form ant design
  const onFinish: FormProps<FieldType>['onFinish'] = (value) => {
    if (value.email && value.password) {
      handleLogin({ email: value.email, password: value.password })
    }
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const [errors, setErrors] = useState('')

  //Call and handle response api
  const { setUser } = useUserStore()
  const handleLogin = async (value: { email: string; password: string }) => {
    try {
      setLoading(true)
      const response = await Login(value.email, value.password)
      if (!response) {
        console.error('Response is undefined')
        return
      }

      if (response.status === StatusCodeConstants.OK) {
        const user = response.data.data.user
        const token = response.data.data.token
        setLoading(true)
        cookieStorage.setItem(ApplicationConstants.TOKEN, token)
        setUser(user, token)
        ToastMessage({ msg: 'Đăng nhập thành công', position: 'top-right', type: 'success' })
        navigate('/dashboard')
      } else if (response.status === StatusCodeConstants.BAD_REQUEST) {
        setLoading(false)
        setErrors(response.data.message)
        ToastMessage({ msg: `${errors}`, position: 'top-right', type: 'error' })
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div className='max-w-[600px] mx-auto my-10'>
      <Form
        name='basic'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item<FieldType>
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label='Password'
          name='password'
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label={null}>
          <LoadingButton htmlType='submit' textButton='Submit' loading={loading} />
        </Form.Item>
      </Form>
    </div>
  )
}
export default LoginPage
