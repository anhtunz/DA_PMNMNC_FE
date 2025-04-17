import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface UserProfile {
  id: number | null
  name: string | null
  email: string | null
  address: string | null
  gender: string | null
  dateOfBirth: string | null
  avatar: string | null
  loading: boolean
  error: string | null
}

const initialState: UserProfile = {
  id: null,
  name: null,
  email: null,
  address: null,
  gender: null,
  dateOfBirth: null,
  avatar: null,
  loading: false,
  error: null
}

interface UserProfilePayload {
  id: number
  name: string
  email: string
  address: string | null
  gender: string
  dateOfBirth: string | null
  avatar: string | null
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserProfilePayload>) => {
      state.loading = false
      state.id = action.payload.id
      state.name = action.payload.name
      state.email = action.payload.email
      state.address = action.payload.address
      state.gender = action.payload.gender
      state.dateOfBirth = action.payload.dateOfBirth
      state.avatar = action.payload.avatar
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    updateProfileStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateProfileSuccess: (state, action: PayloadAction<Partial<UserProfilePayload>>) => {
      state.loading = false
      Object.assign(state, action.payload)
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    updateAvatarSuccess: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload
    }
  }
})

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updateAvatarSuccess
} = profileSlice.actions

export { profileSlice }
