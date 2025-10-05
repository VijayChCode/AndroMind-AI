# Render Deployment Guide for AndroMind AI Backend

This guide will help you deploy the AndroMind AI backend to Render successfully.

## 🚀 Render Configuration

### 1. Service Settings

**Root Directory:** `backend`
**Build Command:** `npm install && npm run build`
**Start Command:** `npm start`

### 2. Environment Variables

Set these environment variables in your Render dashboard:

#### Required Variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andromind-ai
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### Email Configuration:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

#### CORS Configuration:
```
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 🔧 Troubleshooting Render Deployment

### Issue 1: "Unknown file extension .ts"
**Problem:** Render is trying to run TypeScript files directly.

**Solution:**
1. Ensure **Root Directory** is set to `backend`
2. Ensure **Build Command** is `npm install && npm run build`
3. Ensure **Start Command** is `npm start`

### Issue 2: Build Fails
**Problem:** TypeScript compilation errors.

**Solution:**
1. Check that all dependencies are in `package.json`
2. Ensure TypeScript is properly configured
3. Check for any syntax errors in the code

### Issue 3: Runtime Errors
**Problem:** Application crashes after deployment.

**Solution:**
1. Check environment variables are set correctly
2. Ensure MongoDB URI is valid
3. Check logs for specific error messages

## 📋 Step-by-Step Deployment

### 1. Create Render Account
1. Go to [Render](https://render.com/)
2. Sign up with GitHub
3. Connect your GitHub account

### 2. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository: `VijayChCode/AndroMind-AI`

### 3. Configure Service
```
Name: andromind-backend
Environment: Node
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

### 4. Set Environment Variables
Add all the environment variables listed above.

### 5. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Check logs for any errors

## 🔍 Monitoring Deployment

### Check Build Logs
Look for these success indicators:
```
✅ npm install completed
✅ npm run build completed
✅ Compiled TypeScript successfully
```

### Check Runtime Logs
Look for these success indicators:
```
🔄 Attempting to connect to MongoDB...
✅ MongoDB Connected Successfully!
🚀 AndroMind AI Backend Server Started!
```

## 🛠️ Alternative Configuration Methods

### Method 1: Using render.yaml
The project includes a `render.yaml` file in the root directory that can be used for automatic configuration.

### Method 2: Using Procfile
The backend includes a `Procfile` with the start command.

### Method 3: Manual Configuration
If automatic configuration doesn't work, manually set:
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

## 🚨 Common Issues and Solutions

### Issue: "Cannot find module"
**Solution:** Ensure all dependencies are in `package.json` and not in `devDependencies` if needed at runtime.

### Issue: "MongoDB connection failed"
**Solution:** 
1. Check MongoDB URI is correct
2. Ensure MongoDB Atlas allows connections from Render
3. Check network access settings

### Issue: "Port already in use"
**Solution:** Render automatically assigns a port via `process.env.PORT`. Don't hardcode port numbers.

## 📊 Health Check

Once deployed, test your backend:

```bash
# Health check
curl https://your-render-url.onrender.com/api/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "database": "Connected",
  "uptime": 123.456
}
```

## 🔄 Updating Deployment

To update your deployment:
1. Push changes to your GitHub repository
2. Render will automatically redeploy
3. Check logs for any issues

## 📞 Support

If you encounter issues:
1. Check Render logs for specific error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is accessible
4. Check that all dependencies are properly installed

---

**Need help?** Check the Render documentation or create an issue on GitHub.
