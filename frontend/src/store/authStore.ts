import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { authAPI } from '../services/api'

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

// Debug logging
console.log('🔗 API Base URL:', import.meta.env.VITE_API_URL || 'https://andromind-ai.onrender.com/api')
console.log('🌍 Environment:', import.meta.env.MODE)

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
          
          const response = await authAPI.login(email, password)

          if (response.data.success) {
            const { user, token, refreshToken } = response.data
            
            // Set cookies
            Cookies.set('token', token, { expires: 7 })
            Cookies.set('refreshToken', refreshToken, { expires: 30 })
            
            // Store in localStorage for API service
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            
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
          
          const response = await authAPI.register(name, email, password)

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
        
        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        })
      },

      verifyEmail: async (token: string) => {
        try {
          const response = await authAPI.verifyEmail(token)
          
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
          const response = await authAPI.forgotPassword(email)
          
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
          const response = await authAPI.resetPassword(token, password)
          
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
          const response = await authAPI.sendOTP(email)
          
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
          const response = await authAPI.verifyOTP(email, otp)
          
          if (response.data.success) {
            const { user, token, refreshToken } = response.data
            
            // Set cookies
            Cookies.set('token', token, { expires: 7 })
            Cookies.set('refreshToken', refreshToken, { expires: 30 })
            
            // Store in localStorage for API service
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
            
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

          const response = await authAPI.refreshToken(refreshToken)

          if (response.data.success) {
            const { token, refreshToken: newRefreshToken } = response.data
            
            // Update cookies
            Cookies.set('token', token, { expires: 7 })
            Cookies.set('refreshToken', newRefreshToken, { expires: 30 })
            
            // Update localStorage
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', newRefreshToken)
            
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
