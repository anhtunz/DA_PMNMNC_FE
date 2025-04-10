import { configureStore } from '@reduxjs/toolkit'
import { profileSlice } from './slice/user/userProfileSlice'
export const store = configureStore({
  reducer: {
    profile: profileSlice.reducer
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
