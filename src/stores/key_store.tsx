import { create } from 'zustand'

// Define the interface for your store state
interface UserState {
  user: any | null
  setUser: (newUser: any) => void
  clearUser: () => void
  isAuthenticatedZustand: () => boolean
}

// Create the store with the proper type
export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (newUser: any) => set({ user: newUser }),
  clearUser: () => set({ user: null }),
  isAuthenticatedZustand: () => get().user !== null
}))

interface UserLoadingState {
  isUserLoading: boolean
  setIsUserLoading: (state :boolean) => void
}

export const useUserLoading = create<UserLoadingState>((set) => ({
  isUserLoading: false,
  setIsUserLoading: (state: boolean) => set({ isUserLoading: state })
}))
