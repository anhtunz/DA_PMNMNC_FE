import { create } from 'zustand'
import cookieStorage from '../components/helpers/cookieHandler'
import ApplicationConstants from '../constant/ApplicationConstant'

type User = {
  id: string
  email: string
  name: string
  avatar: string
  roles: string[]
}

type UserStore = {
  user: User | null
  token: string | null
  setUser: (user: User | null, token: string) => void
  logout: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setUser: (user: User | null, token: string) => {
    // Lưu token vào cookie mỗi khi setUser được gọi
    if (token) {
      cookieStorage.setItem(ApplicationConstants.TOKEN, token);
    }
    set({ user, token });
  },
  logout: () => {
    cookieStorage.removeItem(ApplicationConstants.TOKEN);
    set({ user: null, token: null });
  },
}));
export default useUserStore
