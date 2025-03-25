/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from 'antd'
import Login from '../../services/auth/login'
import { loginSuccess } from '../../stores/slice/user/authSlice'
import { useSelector } from 'react-redux'
import { RootState } from '../../stores'
const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState([])
  const [errorPassword, setErrorPassword] = useState([])
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])
  //Call and handle response api
  const handleLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    try {
      const response = await Login(email, password)
      if (!response) {
        console.error('Response is undefined')
        return
      }
      if (response?.status === 200) {
        alert('Đăng nhập thành công')
        const token = response?.data?.data?.token
        dispatch(loginSuccess({ token }))
        navigate('/dashboard')
      } else if ('errors' in response && response.status === 422) {
        setErrorEmail(response.errors.errors.email || [])
        setErrorPassword(response.errors.errors.password || [])
      } else if ('errors' in response && response.status === 400) {
        alert(response.errors.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  //Error is hidden after 3s
  useEffect(() => {
    if (errorEmail.length > 0 || errorPassword.length > 0) {
      const timeout = setTimeout(() => {
        setErrorEmail([])
        setErrorPassword([])
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [errorEmail, errorPassword])

  return (
    <form className='max-w-xl mx-auto'>
      <div className='mb-3'>
        <label htmlFor='Email' className='text-red-400 font-bold'>
          * Email
        </label>
        <input
          type='text'
          name='email'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none'
          placeholder=''
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errorEmail.length > 0 &&
          errorEmail.map((error, index) => (
            <p key={index} className='text-red-400 font-bold'>
              {error}
            </p>
          ))}
      </div>
      <div className='mb-3'>
        <label htmlFor='Username' className='text-red-400 font-bold'>
          * Username
        </label>
        <input
          type='password'
          name='password'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none'
          placeholder=''
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorPassword.length > 0 &&
          errorPassword.map((error, index) => (
            <p key={index} className='text-red-400 font-bold'>
              {error}
            </p>
          ))}
      </div>
      <Button type='primary' onClick={handleLogin}>
        Login
      </Button>
    </form>
  )
}
export default LoginPage
