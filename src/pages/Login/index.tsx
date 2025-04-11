import { useState } from 'react'
import { Form, FormProps, Input } from 'antd'
import LoadingButton from '../../components/common/LoadingButton'
import { useNavigate } from 'react-router-dom'
import useLoginHandler from '../../services/auth/LoginHandler'
type FieldType = {
  email?: string
  password?: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { login } = useLoginHandler()

  //Form ant design
  const onFinish: FormProps<FieldType>['onFinish'] = (value) => {
    if (value.email && value.password) {
      login({
        email: value.email,
        password: value.password,
        setLoading,
        onSuccess: () => navigate('/dashboard')
      })
    }
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
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
