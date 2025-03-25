/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd'
import Register from '../../services/auth/register'
import { loginSuccess } from '../../stores/slice/user/authSlice'
import { RootState } from '../../stores'
import { Link } from 'react-router-dom'
import { ApiErrorResponse, ApiSuccessResponse } from '../../services/auth/register'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorName, setErrorName] = useState<string[]>([])
  const [errorEmail, setErrorEmail] = useState<string[]>([])
  const [errorPassword, setErrorPassword] = useState<string[]>([])
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleRegister = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    try {
      const response = await Register({ name, email, password })

      if (!response) {
        console.error('Response is undefined')
        return
      }

      if (response.status === 200) {
        alert('Đăng ký thành công')
        const token = (response as ApiSuccessResponse).data.data.token
        dispatch(loginSuccess({ token }))
        navigate('/dashboard')
      } else if (response.status === 422) {
        const errorResponse = response as ApiErrorResponse
        setErrorName(errorResponse.errors.errors?.name || [])
        setErrorEmail(errorResponse.errors.errors?.email || [])
        setErrorPassword(errorResponse.errors.errors?.password || [])
      } else if (response.status === 400) {
        const errorResponse = response as ApiErrorResponse
        alert(errorResponse.errors.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Hide errors after 3s
  useEffect(() => {
    if (errorName.length > 0 || errorEmail.length > 0 || errorPassword.length > 0) {
      const timeout = setTimeout(() => {
        setErrorName([])
        setErrorEmail([])
        setErrorPassword([])
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [errorName, errorEmail, errorPassword])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errorName.length > 0 &&
                errorName.map((error, index) => (
                  <p key={index} className="text-red-400 font-bold text-sm mt-1">
                    {error}
                  </p>
                ))}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail.length > 0 &&
                errorEmail.map((error, index) => (
                  <p key={index} className="text-red-400 font-bold text-sm mt-1">
                    {error}
                  </p>
                ))}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword.length > 0 &&
                errorPassword.map((error, index) => (
                  <p key={index} className="text-red-400 font-bold text-sm mt-1">
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div>
            <Button
              type="primary"
              htmlType="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng ký
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
