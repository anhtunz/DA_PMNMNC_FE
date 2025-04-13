// import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
// import type { RootState, AppDispatch } from './index'

// // Use throughout the app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = () => useDispatch<AppDispatch>()
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// // Simplified selectors
// export const useUserStore = () => {
//   const { isAuthenticated, token } = useAppSelector((state) => state.auth)
//   const profile = useAppSelector((state) => state.profile)

//   return {
//     isAuthenticatedZustand: isAuthenticated,
//     token,
//     user: {
//       id: profile.id,
//       name: profile.name,
//       email: profile.email,
//       gender: profile.gender,
//       address: profile.address,
//       dateOfBirth: profile.dateOfBirth,
//       avatar: profile.avatar
//     },
//     setUser: () => {}, // Not implemented, using redux directly
//     clearUser: () => {} // Not implemented, using redux directly
//   }
// }

// export const useProfileStore = () => {
//   return useAppSelector((state) => state.profile)
// }
// 
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Profile store selector
export const useProfileStore = () => {
  return useAppSelector((state) => state.profile)
}