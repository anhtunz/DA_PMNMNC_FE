import { useState } from 'react'
import { Flex, Form, FormProps, Input } from 'antd'
import LoadingButton from '../../components/common/LoadingButton'
import { Link, useNavigate } from 'react-router-dom'
import useLoginHandler from '../../services/auth/loginHandler'
import { LockOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import ApplicationConstants from '../../constant/ApplicationConstant'
import { useTitle } from '../../hooks/useTitle'

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
        onSuccess: () => navigate('dashboard')
      })
    }
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  useTitle('Đăng nhập')
  return (
    <>
      <div className='min-h-screen bg-gray-100 text-gray-900 flex justify-center'>
        <div className='max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
          <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
            <div>
              <img
                src='http://res.cloudinary.com/dkeclpsjq/image/upload/v1748093528/DAPMNM/gufw0luvn3ynsqasdhbz.jpg'
                className='w-40 mx-auto'
              />
            </div>
            <div className='mt-12 flex flex-col items-center'>
              <h1 className='text-2xl xl:text-3xl font-extrabold'>Đăng nhập</h1>
              <div className='w-full flex-1 mt-8'>
                <div className='mx-auto max-w-xs w-full'>
                  <Form
                    name='basic'
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                  >
                    <Form.Item<FieldType>
                      name='email'
                      rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Nhập đúng định dạng email!' }
                      ]}
                    >
                      <Input
                        style={{ padding: '12px' }}
                        prefix={<UserOutlined className='pr-3' />}
                        placeholder='Email'
                      />
                    </Form.Item>

                    <Form.Item<FieldType>
                      name='password'
                      rules={[
                        { required: true, message: 'Vui lòng nhập password!' },
                        { min: 6, message: 'Password tối thiểu 6 ký tự!' }
                      ]}
                    >
                      <Input.Password
                        style={{ padding: '12px' }}
                        prefix={<LockOutlined className='pr-3' />}
                        type='password'
                        placeholder='Mật khẩu'
                      />
                    </Form.Item>
                    <Flex justify='space-between' align='center'>
                      <Link to={ApplicationConstants.FORGOT_PASSWORD_PATH}>Quên mật khẩu?</Link>
                    </Flex>

                    <LoadingButton
                      htmlType='submit'
                      type='link'
                      styleCss='mt-5 h-10 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
                      loading={loading}
                    >
                      <UserAddOutlined />
                      Đăng nhập
                    </LoadingButton>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div className='flex-1 bg-indigo-100 text-center hidden lg:flex'>
            <div
              className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')"
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  )
}
export default LoginPage
