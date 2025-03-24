import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CheckAuth {
  isAuthenticated: boolean
  token: string | null
}

const token = localStorage.getItem('auth_token')

const initialState: CheckAuth = {
  isAuthenticated: !!token,
  token
}
interface LoginPayload {
  token: string
}
const authSlice = createSlice({
  name: 'checkAuth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      localStorage.setItem('auth_token', action.payload.token)
    }
  }
})
export const { loginSuccess } = authSlice.actions
export { authSlice }
