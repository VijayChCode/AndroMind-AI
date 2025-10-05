import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { generateToken, generateRefreshToken, authenticateToken } from '../middleware/auth'
import emailService from '../services/emailService'
import crypto from 'crypto'

const router = express.Router()

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2, max: 50 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      })
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      emailVerificationToken: crypto.randomBytes(32).toString('hex')
    })

    await user.save()

    // Send verification email
    await emailService.sendVerificationEmail(user, user.emailVerificationToken!)

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    })
  }
})

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      },
      token,
      refreshToken
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
})

// Verify Email
router.post('/verify-email', [
  body('token').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    const user = await User.findOne({ emailVerificationToken: token })
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined
    await user.save()

    // Send welcome email
    await emailService.sendWelcomeEmail(user)

    res.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({
      success: false,
      error: 'Email verification failed'
    })
  }
})

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    // Send reset email
    await emailService.sendPasswordResetEmail(user, resetToken)

    res.json({
      success: true,
      message: 'Password reset email sent'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send reset email'
    })
  }
})

// Reset Password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      error: 'Password reset failed'
    })
  }
})

// Send OTP
router.post('/send-otp', [
  body('email').isEmail().normalizeEmail()
], async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in user document (you might want to create a separate OTP model)
    user.resetPasswordToken = otp
    user.resetPasswordExpires = new Date(Date.now() + 600000) // 10 minutes
    await user.save()

    // Send OTP email
    await emailService.sendOTPEmail(user, otp)

    res.json({
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    })
  }
})

// Verify OTP
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 })
], async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      })
    }

    // Clear OTP
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    // Generate tokens
    const token = generateToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      },
      token,
      refreshToken
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      error: 'OTP verification failed'
    })
  }
})

// Get Current User
router.get('/me', authenticateToken, async (req: any, res: Response) => {
  res.json({
    success: true,
    user: req.user
  })
})

// Refresh Token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string, type: string }
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      })
    }

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

    const newToken = generateToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)

    res.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    })
  }
})

export { router as authRouter }
