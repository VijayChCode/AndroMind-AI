# MongoDB Setup Guide for AndroMind AI

This guide will help you set up MongoDB for the AndroMind AI project. You have two options: **MongoDB Atlas (Cloud)** or **Local MongoDB Installation**.

## 🌐 Option 1: MongoDB Atlas (Recommended for Development)

MongoDB Atlas is a cloud-based MongoDB service that's free to use and doesn't require local installation.

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create a Cluster
1. Click "Create a new cluster"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a region close to you
4. Click "Create Cluster"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name (e.g., `andromind-ai`)

### Step 6: Update Environment Variables
Add the connection string to your `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andromind-ai?retryWrites=true&w=majority
```

## 💻 Option 2: Local MongoDB Installation

### Windows Installation

#### Method 1: MongoDB Community Server
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB Compass (optional GUI tool)
5. Start MongoDB service

#### Method 2: Using Chocolatey
```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb
```

#### Method 3: Using Docker
```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

### macOS Installation

#### Method 1: Using Homebrew
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community
```

#### Method 2: Using Docker
```bash
# Pull and run MongoDB
docker run -d --name mongodb -p 27017:27017 mongo
```

### Linux Installation

#### Ubuntu/Debian
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Local MongoDB Configuration

If using local MongoDB, update your `backend/.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/andromind-ai
```

## 🔧 Environment Variables

Create a `backend/.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andromind-ai?retryWrites=true&w=majority

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Testing the Connection

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check the console output:**
   You should see:
   ```
   🔄 Attempting to connect to MongoDB...
   🔗 MongoDB URI found, connecting...
   ✅ MongoDB Connected Successfully!
   📍 Host: cluster0.xxxxx.mongodb.net
   🗃️  Database: andromind-ai
   🔌 Port: 27017
   📊 Ready State: 1
   ```

3. **Test the health endpoint:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 🔍 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check your internet connection
   - Verify the MongoDB URI is correct
   - Ensure MongoDB Atlas cluster is running

2. **Authentication Failed**
   - Verify username and password
   - Check database user permissions
   - Ensure the user has read/write access

3. **Network Access Denied**
   - Add your IP address to MongoDB Atlas Network Access
   - Use "Allow Access from Anywhere" for development

4. **Local MongoDB Won't Start**
   - Check if MongoDB service is running
   - Verify port 27017 is not in use
   - Check MongoDB logs for errors

### Useful Commands

```bash
# Check MongoDB status (Linux/macOS)
sudo systemctl status mongod

# Start MongoDB service (Linux/macOS)
sudo systemctl start mongod

# Check if MongoDB is running
netstat -an | grep 27017

# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use your database
use andromind-ai

# Show collections
show collections
```

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Server Documentation](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI tool for MongoDB

## 🎯 Next Steps

Once MongoDB is set up and running:

1. Start the backend server: `npm run dev`
2. Start the frontend server: `npm run dev:frontend`
3. Test user registration and login
4. Verify chat functionality
5. Deploy to production (Vercel + Render + MongoDB Atlas)

---

**Need help?** Check the console logs for detailed connection information and error messages.
