import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'

interface AuthState {
  user: User | null
  accessToken: string | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    logout: (state) => {
      state.user = null
      state.accessToken = null
      state.loading = false
    },
  },
})

export const { setUser, setToken, setLoading, logout } = authSlice.actions
export default authSlice.reducer
