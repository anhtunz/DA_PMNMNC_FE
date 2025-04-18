import { useState } from 'react'
import { Flex, Form, FormProps, Input } from 'antd'
import LoadingButton from '../../components/common/LoadingButton'
import { useNavigate } from 'react-router-dom'
import useLoginHandler from '../../services/auth/loginHandler'

type FieldType = {
  email?: string
  password?: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { login } = useLoginHandler()

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
        style={{ maxWidth: 500 }}
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
        <Form.Item>
          <Flex justify='space-between' align='center'>
            <Form.Item name='remember' valuePropName='checked' noStyle>
              <a href='/new-login'>New Login UI!</a>
            </Form.Item>
            <a href='/forgot-password'>Forgot password</a>
          </Flex>
        </Form.Item>
        <Form.Item label={null}>
          <LoadingButton htmlType='submit' textButton='Submit' loading={loading} />
        </Form.Item>
      </Form>
    </div>
  )
}
export default LoginPage
