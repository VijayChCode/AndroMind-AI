import axios from 'axios'

// Configure API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://andromind-ai.onrender.com/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) => 
    api.post('/auth/register', { name, email, password }),
  
  verifyEmail: (token: string) => 
    api.post('/auth/verify-email', { token }),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  
  sendOTP: (email: string) => 
    api.post('/auth/send-otp', { email }),
  
  verifyOTP: (email: string, otp: string) => 
    api.post('/auth/verify-otp', { email, otp }),
  
  refreshToken: (refreshToken: string) => 
    api.post('/auth/refresh', { refreshToken }),
  
  getCurrentUser: () => 
    api.get('/auth/me')
}

// Chat API calls
export const chatAPI = {
  sendMessage: (message: string, chatId?: string) => 
    api.post('/chat', { message, chatId }),
  
  getChatHistory: (chatId: string) => 
    api.get(`/chat/history/${chatId}`),
  
  getAllChats: () => 
    api.get('/chat'),
  
  deleteChat: (chatId: string) => 
    api.delete(`/chat/${chatId}`),
  
  updateChatTitle: (chatId: string, title: string) => 
    api.put(`/chat/${chatId}/title`, { title })
}

export default api
