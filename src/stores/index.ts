import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './slice/counterSlice'
import { authSlice } from './slice/user/authSlice'
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    auth: authSlice.reducer
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
