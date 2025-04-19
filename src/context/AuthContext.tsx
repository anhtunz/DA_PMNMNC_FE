// context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { NetworkManager } from '../config/network_manager'
import APIPathConstants from '../constant/ApiPathConstants'
import cookieStorage from '../components/helpers/cookieHandler'
import ApplicationConstants from '../constant/ApplicationConstant'
import useUserStore from '../stores/userStore'

type AuthContextType = {
  isAuthenticated: boolean
  authChecked: boolean
  user: any
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  authChecked: true,
  user: null
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authChecked, setAuthChecked] = useState(false)
  const { user, setUser, token } = useUserStore()

  useEffect(() => {
    const fetchUser = async () => {
      const saveToken = cookieStorage.getItem(ApplicationConstants.TOKEN)
      if (!saveToken) {
        setAuthChecked(true)
        return
      }
      try {
        const res = await NetworkManager.instance.getDataFromServer(APIPathConstants.REFRESH_TOKEN_PATH)
        const newToken = res.data.data.token
        cookieStorage.setItem(ApplicationConstants.TOKEN, newToken)
        setUser(res.data.data.user, newToken)
      } catch (err) {
        console.error('AuthProvider: error fetching user', err)
      } finally {
        setAuthChecked(true)
      }
    }
    fetchUser()
  }, [])

  const isAuthenticated = !!user && !!token
  return <AuthContext.Provider value={{ isAuthenticated, user, authChecked }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
