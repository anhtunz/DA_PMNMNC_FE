import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, CountdownProps, Form, Input, Statistic } from 'antd'
import { useEffect, useState } from 'react'
import { toastService } from '../../../services/toast/ToastService'
import { NetworkManager } from '../../../config/network_manager'
import APIPathConstants from '../../../constant/ApiPathConstants'
import { useNavigate } from 'react-router-dom'

const { Countdown } = Statistic
const ForgetPassword = () => {
  const navigate = useNavigate()
  const [isShowOTP, setIsShowOTP] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isShowResetPassword, setIsShowResetPassword] = useState(false)
  const [isMatchOTP, setIsMatchOTP] = useState(false)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [isFinsh, setIsFinish] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async (values: any) => {
    if (isShowOTP) {
      const resetKey = getCookie('reset_key') ?? ''
      const isMatch = await compareHash(values.otp, resetKey)
      if (isMatch) {
        toastService.success('Mã OTP hợp lệ')
        setIsShowResetPassword(true)
        setIsMatchOTP(true)
      } else {
        toastService.error('Mã OTP không đúng')
      }
    }
    if (!isShowResetPassword) {
      setIsShowOTP(true)
    }
    if (isShowResetPassword) {
      await changePassword(values.Email, values.password)
      form.resetFields()
      navigate('/login')
    }
  }
  const sendOTPMail = async (email: string, otp: string) => {
    const body = {
      email: email,
      otp: otp
    }
    const id = toastService.default('Đang xử lý', {
      autoClose: false,
      closeButton: false,
      isLoading: true
    })
    try {
      await NetworkManager.instance.createDataInServer(APIPathConstants.FORGOT_PASSWORD_PATH, body)
      toastService.update(id, {
        render: 'Mã OTP đã được gửi đến email của bạn',
        type: 'success',
        autoClose: 2000,
        closeButton: true,
        isLoading: false
      })
    } catch (err: any) {
      console.error('Error sendMailForgotPassword: ', err)
      toastService.error(err)
    }
  }

  const changePassword = async (email: string, newpass: string) => {
    const body = {
      email: email,
      password: newpass
    }
    const id = toastService.default('Đang xử lý', {
      autoClose: false,
      closeButton: false,
      isLoading: true
    })
    try {
      await NetworkManager.instance.createDataInServer(APIPathConstants.REFRESH_PASS_PATH, body)
      toastService.update(id, {
        render: 'Mật khẩu của bạn đã được đổi thành công',
        type: 'success',
        autoClose: 2000,
        closeButton: true,
        isLoading: false
      })
    } catch (err: any) {
      console.error('Error sendMailForgotPassword: ', err)
      toastService.error(err)
    }
  }

  useEffect(() => {
    setIsShowOTP(false)
  }, [isMatchOTP])

  const validateMessages = {
    required: '${label} không được để trống!',
    types: {
      email: 'Không phải là email hợp lệ!',
      number: 'Mã OTP là một số'
    }
  }
  const onValuesChange = (changedValues: any, allValues: any) => {
    if ('Email' in changedValues) {
      form
        .validateFields(['Email'])
        .then(() => {})
        .catch(() => {
          setIsShowOTP(false)
        })
    }
  }
  const setCookie = (name: string, value: string, seconds: number): void => {
    const expires = new Date(Date.now() + seconds * 1000).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
  }

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }

  const hashString = async (str: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  const compareHash = async (input: string, storedHash: string): Promise<boolean> => {
    const hashedInput = await hashString(input)
    return hashedInput === storedHash
  }

  const generateRandomCode = async (form: any) => {
    const email = form.getFieldValue('Email')
    if (!isGenerated) {
      const number = Math.floor(Math.random() * 100000)
      const out = number.toString().padStart(5, '0')
      //   console.log('Random code generated:', out)
      const hashKey = await hashString(out)
      setCookie('reset_key', hashKey, 100)
      setIsGenerated(true)
      await sendOTPMail(email, out)
    }
  }

  useEffect(() => {
    const endTimeStr = getCookie('button_end_time')
    const resetKeyExists = getCookie('reset_key')

    if (endTimeStr) {
      const endTime = parseInt(endTimeStr, 10)
      const now = Date.now()

      if (endTime > now) {
        setIsDisable(true)
        setDeadline(endTime)

        if (resetKeyExists) {
          setIsGenerated(true)
        }
      } else {
        setCookie('button_end_time', '', 0)
        setCookie('reset_key', '', 0)
      }
    }
  }, [])

  const handleOnClickButton = async (form: any) => {
    const endTime = Date.now() + 1000 * 100
    setDeadline(endTime)
    setIsDisable(true)
    setCookie('button_end_time', endTime.toString(), 100)

    await generateRandomCode(form)
  }

  const onFinishOTP: CountdownProps['onFinish'] = () => {
    if (isMatchOTP == true) {
      setIsDisable(true)
      setIsGenerated(true)
    } else {
      setIsDisable(false)
      setIsGenerated(false)
    }
    setCookie('button_end_time', '', 0)
    setCookie('reset_key', '', 0)
    console.log('finished!')
  }

  return (
    <div className='min-h-screen bg-gray-100 text-gray-900 flex justify-center'>
      <div className='max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
          <div>
            <img
              src='https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png'
              className='w-32 mx-auto'
            />
          </div>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-extrabold'>Quên mật khẩu</h1>
            <div className='w-full flex-1 mt-8'>
              <div className='mx-auto max-w-xs'>
                <Form
                  name='login'
                  initialValues={{ remember: true }}
                  style={{ maxWidth: 360 }}
                  onFinish={onFinish}
                  form={form}
                  onValuesChange={onValuesChange}
                  validateMessages={validateMessages}
                  layout='vertical'
                >
                  <Form.Item name='Email' label='Email: ' rules={[{ required: true, type: 'email' }]}>
                    <Input placeholder='abc@gmail.com' />
                  </Form.Item>
                  {isShowOTP && (
                    <Form.Item
                      name='otp'
                      label='Mã OTP: '
                      rules={[{ required: true }, { pattern: /^[0-9]+$/, message: 'Mã OTP chỉ được chứa các chữ số' }]}
                    >
                      <div className='flex gap-2'>
                        <Input placeholder='Mã OTP' maxLength={6} />
                        <Button
                          onClick={() => {
                            handleOnClickButton(form)
                          }}
                          disabled={isDisable}
                        >
                          {isDisable ? (
                            <Countdown value={deadline || Date.now()} onFinish={onFinishOTP} format='ss' />
                          ) : (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='w-5 h-5'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5'
                              />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </Form.Item>
                  )}
                  {isShowResetPassword && (
                    <>
                      <Form.Item
                        label='Mật khẩu mới:'
                        name='password'
                        rules={[{ required: true, message: 'Mật khẩu mới không được để trống' }]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        label='Xác nhận mật khẩu'
                        name='password2'
                        dependencies={['password']}
                        rules={[
                          {
                            required: true,
                            message: 'Không được để trống'
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value && getFieldValue('password') === value) {
                                setIsFinish(true)
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error('Mật khẩu không khớp'))
                            }
                          })
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </>
                  )}
                  <Form.Item>
                    <Button
                      icon={
                        isFinsh ? (
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                          </svg>
                        ) : (
                          <ArrowRightOutlined />
                        )
                      }
                      iconPosition='end'
                      block
                      type='primary'
                      htmlType='submit'
                    >
                      {isFinsh ? 'Hoàn thành' : 'Tiếp tục'}
                    </Button>
                  </Form.Item>
                </Form>
                <div className='flex items-end justify-end'>
                  <Button onClick={() => navigate('/login')} color='orange' variant='link'>
                    Về trang đăng nhập
                  </Button>
                </div>
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
  )
}

export default ForgetPassword
