import { configureStore } from '@reduxjs/toolkit'
import { profileSlice } from './slice/user/userProfileSlice'
import { createSlice } from '@reduxjs/toolkit'
import cookieStorage from '../components/helpers/cookieHandler'
import ApplicationConstants from '../constant/ApplicationConstant'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!cookieStorage.getItem(ApplicationConstants.TOKEN),
    token: cookieStorage.getItem(ApplicationConstants.TOKEN) || null,
    loading: false
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true
      state.token = action.payload
    },
    clearAuth: (state) => {
      state.isAuthenticated = false
      state.token = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const { setAuth, clearAuth, setLoading } = authSlice.actions
export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
