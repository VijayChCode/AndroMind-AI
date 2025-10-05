import { Request, Response, NextFunction } from 'express'

export const validateChatRequest = (req: Request, res: Response, next: NextFunction) => {
  const { message, chatId } = req.body

  // Validate required fields
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Message is required and must be a non-empty string'
    })
  }

  // Validate message length
  if (message.length > 10000) {
    return res.status(400).json({
      success: false,
      error: 'Message is too long (maximum 10,000 characters)'
    })
  }

  // Validate chatId if provided
  if (chatId && typeof chatId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Chat ID must be a string'
    })
  }

  // Validate context if provided
  if (req.body.context && typeof req.body.context !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Context must be a string'
    })
  }

  next()
}