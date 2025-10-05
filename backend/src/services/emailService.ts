import nodemailer from 'nodemailer'
import { IUser } from '../models/User'

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async sendVerificationEmail(user: IUser, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
    
    const mailOptions = {
      from: `"AndroMind AI" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Verify Your AndroMind AI Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AndroMind AI</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for signing up for AndroMind AI. To complete your registration and start using our advanced AI assistant, please verify your email address.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This verification link will expire in 24 hours. If you didn't create an account with AndroMind AI, please ignore this email.
            </p>
          </div>
        </div>
      `
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendPasswordResetEmail(user: IUser, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    
    const mailOptions = {
      from: `"AndroMind AI" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset Your AndroMind AI Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your AndroMind AI account. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              This reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
          </div>
        </div>
      `
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendOTPEmail(user: IUser, otp: string): Promise<void> {
    const mailOptions = {
      from: `"AndroMind AI" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Your AndroMind AI Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Login Verification</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa; text-align: center;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Use this One-Time Password (OTP) to complete your login:
            </p>
            <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This OTP will expire in 10 minutes. If you didn't request this login, please ignore this email.
            </p>
          </div>
        </div>
      `
    }

    await this.transporter.sendMail(mailOptions)
  }

  async sendWelcomeEmail(user: IUser): Promise<void> {
    const mailOptions = {
      from: `"AndroMind AI" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Welcome to AndroMind AI! 🚀',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to AndroMind AI! 🚀</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Hi ${user.name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your account has been successfully verified! You can now start using AndroMind AI's advanced features:
            </p>
            <ul style="color: #666; font-size: 16px; line-height: 1.8;">
              <li>💬 Advanced AI conversations with context awareness</li>
              <li>🎨 Beautiful, responsive interface</li>
              <li>📝 Markdown support with code highlighting</li>
              <li>💾 Save and organize your conversations</li>
              <li>🔍 Search through your chat history</li>
              <li>📤 Export your conversations</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Start Chatting Now
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Thank you for choosing AndroMind AI. We're excited to have you on board!
            </p>
          </div>
        </div>
      `
    }

    await this.transporter.sendMail(mailOptions)
  }
}

export default new EmailService()
