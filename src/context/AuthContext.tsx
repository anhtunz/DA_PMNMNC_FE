// context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { NetworkManager } from '../config/network_manager'
import APIPathConstants from '../constant/ApiPathConstants'
import cookieStorage from '../components/helpers/cookieHandler'
import ApplicationConstants from '../constant/ApplicationConstant'
import useUserStore from '../stores/userStore'
import { useDispatch } from 'react-redux'
import { setAuth, setLoading as setReduxLoading } from '../stores'
import { userNavigate } from 'react-router-dom'
type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  user: any
  lougout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  user: null,
  lougout: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const { user, setUser } = useUserStore()
  const token = cookieStorage.getItem(ApplicationConstants.TOKEN)

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await NetworkManager.instance.getDataFromServer(APIPathConstants.REFRESH_TOKEN_PATH)
          const newToken = res.data.data.token
          cookieStorage.setItem(ApplicationConstants.TOKEN, newToken)
          setUser(res.data.data.user, newToken)
        } catch (err) {
          console.error('AuthProvider: error fetching user', err)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
