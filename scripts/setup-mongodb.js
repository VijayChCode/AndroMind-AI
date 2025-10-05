#!/usr/bin/env node

/**
 * MongoDB Setup Helper Script
 * This script helps verify MongoDB connection and setup
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log('🔧 MongoDB Setup Helper');
console.log('======================');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.log('💡 Please create a backend/.env file with:');
  console.log('   MONGODB_URI=mongodb://localhost:27017/andromind-ai');
  console.log('   or');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andromind-ai');
  process.exit(1);
}

console.log('🔗 MongoDB URI found');
console.log('🔄 Testing connection...');

async function testConnection() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ MongoDB connection successful!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗃️  Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    console.log(`📊 Ready State: ${conn.connection.readyState}`);

    // Test basic operations
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 This might be a network connectivity issue');
      console.log('   - Check your internet connection');
      console.log('   - Verify the MongoDB URI is correct');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Authentication failed:');
      console.log('   - Check username and password');
      console.log('   - Verify database user permissions');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Connection timeout:');
      console.log('   - Check if MongoDB is running');
      console.log('   - Verify network access settings');
    }
    
    process.exit(1);
  }
}

testConnection();
