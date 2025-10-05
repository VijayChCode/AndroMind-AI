import { Request, Response } from 'express'
import { OpenAIService } from '../services/openaiService'
import Chat from '../models/Chat'
import { authenticateToken } from '../middleware/auth'

interface AuthRequest extends Request {
  user?: any
}

const openaiService = new OpenAIService()

export const chatController = {
  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { message, chatId, context } = req.body
      const userId = req.user._id

      let chat
      let chatHistory: any[] = []

      // Get or create chat
      if (chatId) {
        chat = await Chat.findOne({ _id: chatId, userId })
        if (chat) {
          chatHistory = chat.messages
        }
      }

      if (!chat) {
        // Create new chat
        chat = new Chat({
          userId,
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          messages: []
        })
      }

      // Add user message
      chat.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      })

      // Generate AI response
      const response = await openaiService.generateResponse({
        message,
        chatHistory,
        context
      })

      // Add AI response
      chat.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      })

      // Update chat title if it's the first message
      if (chat.messages.length === 2) {
        chat.title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
      }

      await chat.save()

      res.json({
        success: true,
        response,
        chatId: chat._id,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Chat controller error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to process message',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  },

  async getChatHistory(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params
      const userId = req.user._id
      
      const chat = await Chat.findOne({ _id: chatId, userId })
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        })
      }
      
      res.json({
        success: true,
        messages: chat.messages
      })
    } catch (error) {
      console.error('Get chat history error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve chat history'
      })
    }
  },

  async getAllChats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user._id
      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 })
        .select('title messages createdAt updatedAt')
      
      res.json({
        success: true,
        chats
      })
    } catch (error) {
      console.error('Get all chats error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve chats'
      })
    }
  },

  async deleteChat(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params
      const userId = req.user._id
      
      const chat = await Chat.findOneAndDelete({ _id: chatId, userId })
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        })
      }
      
      res.json({
        success: true,
        message: 'Chat deleted successfully'
      })
    } catch (error) {
      console.error('Delete chat error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to delete chat'
      })
    }
  },

  async updateChatTitle(req: AuthRequest, res: Response) {
    try {
      const { chatId } = req.params
      const { title } = req.body
      const userId = req.user._id
      
      const chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        { title },
        { new: true }
      )
      
      if (!chat) {
        return res.status(404).json({
          success: false,
          error: 'Chat not found'
        })
      }
      
      res.json({
        success: true,
        message: 'Chat title updated successfully'
      })
    } catch (error) {
      console.error('Update chat title error:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update chat title'
      })
    }
  }
}
