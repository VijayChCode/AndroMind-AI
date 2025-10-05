import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/database'
import { chatRouter } from './routes/chat'
import { authRouter } from './routes/auth'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
console.log('🔧 Setting up middleware...')
app.use(helmet())
// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://andromindai.vercel.app',
      'https://andromindai.vercel.app/',
      process.env.CORS_ORIGIN,
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed origin:', origin)
      callback(null, true)
    } else {
      console.log('❌ CORS blocked origin:', origin)
      console.log('📋 Allowed origins:', allowedOrigins)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use(rateLimiter)
console.log('✅ Middleware configured')

// Routes
console.log('🛣️  Setting up routes...')
app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)
console.log('✅ Routes configured')

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'Connected',
    uptime: process.uptime()
  })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log('')
  console.log('🎉 ==========================================')
  console.log('🚀 AndroMind AI Backend Server Started!')
  console.log('🎉 ==========================================')
  console.log(`🌐 Server running on: http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`)
  console.log(`💬 Chat endpoints: http://localhost:${PORT}/api/chat`)
  console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173'}`)
console.log(`🔗 Allowed Origins: http://localhost:5173, http://localhost:3000, https://andromindai.vercel.app, https://andromindai.vercel.app/`)
  console.log('🎉 ==========================================')
  console.log('')
})
