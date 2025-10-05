import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...')
    
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI
    
    if (!mongoURI) {
      console.error('❌ MongoDB URI is not defined in environment variables')
      console.error('Please set MONGODB_URI in your .env file')
      throw new Error('MongoDB URI is not defined in environment variables')
    }

    console.log('🔗 MongoDB URI found, connecting...')
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
    })

    console.log(`✅ MongoDB Connected Successfully!`)
    console.log(`📍 Host: ${conn.connection.host}`)
    console.log(`🗃️  Database: ${conn.connection.name}`)
    console.log(`🔌 Port: ${conn.connection.port}`)
    console.log(`📊 Ready State: ${conn.connection.readyState}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Shutting down gracefully...')
      await mongoose.connection.close()
      console.log('✅ MongoDB connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.error('💡 Please check:')
    console.error('   1. MongoDB is running (if using local MongoDB)')
    console.error('   2. MongoDB Atlas connection string is correct')
    console.error('   3. Network connectivity')
    console.error('   4. Environment variables are set correctly')
    process.exit(1)
  }
}

export default connectDB
