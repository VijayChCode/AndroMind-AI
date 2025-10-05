import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import axios from 'axios'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isEmailVerified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>
  sendOTP: (email: string) => Promise<{ success: boolean; error?: string }>
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  refreshAuthToken: () => Promise<boolean>
  setLoading: (loading: boolean) => void
}

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
axios.defaults.baseURL = API_BASE_URL

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const response = await axios.post('/auth/login', {
            email,
            password
          })

          if (response.data.success) {
            const { user, token, refreshToken } = response.data
            
            // Set cookies
            Cookies.set('token', token, { expires: 7 })
            Cookies.set('refreshToken', refreshToken, { expires: 30 })
            
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            set({
              user,
              token,
              refreshToken,
              isAuthenticated: true,
              isLoading: false
            })
            
            return { success: true }
          } else {
            set({ isLoading: false })
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
          }
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          set({ isLoading: true })
          
          const response = await axios.post('/auth/register', {
            name,
            email,
            password
          })

          set({ isLoading: false })
          
          if (response.data.success) {
            return { success: true }
          } else {
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          set({ isLoading: false })
          return { 
            success: false, 
            error: error.response?.data?.error || 'Registration failed' 
          }
        }
      },

      logout: () => {
        // Clear cookies
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        
        // Clear axios header
        delete axios.defaults.headers.common['Authorization']
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        })
      },

      verifyEmail: async (token: string) => {
        try {
          const response = await axios.post('/auth/verify-email', { token })
          
          if (response.data.success) {
            return { success: true }
          } else {
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Email verification failed' 
          }
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const response = await axios.post('/auth/forgot-password', { email })
          
          if (response.data.success) {
            return { success: true }
          } else {
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Failed to send reset email' 
          }
        }
      },

      resetPassword: async (token: string, password: string) => {
        try {
          const response = await axios.post('/auth/reset-password', {
            token,
            password
          })
          
          if (response.data.success) {
            return { success: true }
          } else {
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Password reset failed' 
          }
        }
      },

      sendOTP: async (email: string) => {
        try {
          const response = await axios.post('/auth/send-otp', { email })
          
          if (response.data.success) {
            return { success: true }
          } else {
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'Failed to send OTP' 
          }
        }
      },

      verifyOTP: async (email: string, otp: string) => {
        try {
          const response = await axios.post('/auth/verify-otp', { email, otp })
          
          if (response.data.success) {
            const { user, token, refreshToken } = response.data
            
            // Set cookies
            Cookies.set('token', token, { expires: 7 })
            Cookies.set('refreshToken', refreshToken, { expires: 30 })
            
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            set({
              user,
              token,
              refreshToken,
              isAuthenticated: true
            })
            
            return { success: true }
          } else {
            return { success: false, error: response.data.error }
          }
        } catch (error: any) {
          return { 
            success: false, 
            error: error.response?.data?.error || 'OTP verification failed' 
          }
        }
      },

      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get()
          
          if (!refreshToken) {
            return false
          }

          const response = await axios.post('/auth/refresh', {
            refreshToken
          })

          if (response.data.success) {
            const { token, refreshToken: newRefreshToken } = response.data
            
            // Update cookies
            Cookies.set('token', token, { expires: 7 })
            Cookies.set('refreshToken', newRefreshToken, { expires: 30 })
            
            // Update axios header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            set({
              token,
              refreshToken: newRefreshToken
            })
            
            return true
          } else {
            get().logout()
            return false
          }
        } catch (error) {
          get().logout()
          return false
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'andromind-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
