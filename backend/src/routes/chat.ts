import express from 'express'
import { chatController } from '../controllers/chatController'
import { validateChatRequest } from '../middleware/validation'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// Chat endpoints (all require authentication)
router.post('/', authenticateToken, validateChatRequest, chatController.sendMessage)
router.get('/', authenticateToken, chatController.getAllChats)
router.get('/history/:chatId', authenticateToken, chatController.getChatHistory)
router.delete('/:chatId', authenticateToken, chatController.deleteChat)
router.put('/:chatId/title', authenticateToken, chatController.updateChatTitle)

export { router as chatRouter }
