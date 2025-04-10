import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './slice/counterSlice'
import { authSlice } from './slice/user/authSlice'
import { profileSlice } from './slice/user/userProfileSlice'
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer,
    profile: profileSlice.reducer
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
