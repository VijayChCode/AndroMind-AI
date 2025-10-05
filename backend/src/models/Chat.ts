import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokens?: number
}

export interface IChat extends Document {
  _id: string
  userId: Types.ObjectId
  title: string
  messages: IMessage[]
  isArchived: boolean
  isPinned: boolean
  tags: string[]
  totalTokens: number
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  tokens: {
    type: Number,
    default: 0
  }
})

const ChatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  messages: [MessageSchema],
  isArchived: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  totalTokens: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Index for better query performance
ChatSchema.index({ userId: 1, createdAt: -1 })
ChatSchema.index({ userId: 1, isArchived: 1 })
ChatSchema.index({ userId: 1, isPinned: 1 })

export default mongoose.model<IChat>('Chat', ChatSchema)
