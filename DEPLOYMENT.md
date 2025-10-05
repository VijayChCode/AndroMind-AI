# 🚀 AndroMind AI Deployment Guide

This guide will help you deploy your AndroMind AI application to production using Vercel (frontend) and Render (backend) with MongoDB Atlas.

## 📋 Prerequisites

1. **GitHub Account** - For hosting your code
2. **Vercel Account** - For frontend deployment
3. **Render Account** - For backend deployment
4. **MongoDB Atlas Account** - For database
5. **OpenAI API Key** - For AI functionality
6. **Gmail Account** - For email services

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### 1.2 Configure Database
1. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `andromind-user`
   - Password: Generate a secure password
   - Database User Privileges: "Read and write to any database"

2. **Whitelist IP Addresses:**
   - Go to "Network Access" → "Add IP Address"
   - Add `0.0.0.0/0` (allow from anywhere) for development
   - For production, add specific IPs

3. **Get Connection String:**
   - Go to "Clusters" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://andromind-user:yourpassword@cluster0.xxxxx.mongodb.net/andromind-ai?retryWrites=true&w=majority`

## 🔧 Step 2: Backend Deployment (Render)

### 2.1 Prepare Backend
1. Push your code to GitHub
2. Make sure `backend/package.json` has the correct scripts:
   ```json
   {
     "scripts": {
       "start": "node dist/index.js",
       "build": "tsc"
     }
   }
   ```

### 2.2 Deploy to Render
1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name:** `andromind-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** Leave empty

### 2.3 Environment Variables (Render)
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andromind-ai
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OPENAI_API_KEY=your_openai_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=AndroMind AI <your_email@gmail.com>
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 2.4 Gmail App Password Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password as `SMTP_PASS`

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Prepare Frontend
1. Create `frontend/.env` file:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### 3.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.3 Environment Variables (Vercel)
Add these environment variables in Vercel dashboard:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_APP_NAME=AndroMind AI
VITE_APP_VERSION=1.0.0
```

## 🔑 Step 4: Get API Keys

### 4.1 OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys section
4. Create a new secret key
5. Copy the key (starts with `sk-`)

### 4.2 MongoDB Connection String
Use the connection string from Step 1.2

## 📝 Step 5: Environment Variables Summary

### Backend (Render) Environment Variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andromind-ai
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OPENAI_API_KEY=sk-your_openai_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=AndroMind AI <your_email@gmail.com>
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel) Environment Variables:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_APP_NAME=AndroMind AI
VITE_APP_VERSION=1.0.0
```

## 🚀 Step 6: Deployment Process

### 6.1 Deploy Backend First
1. Deploy backend to Render
2. Wait for deployment to complete
3. Test the backend URL: `https://your-backend-url.onrender.com/api/health`

### 6.2 Deploy Frontend
1. Update frontend environment variables with backend URL
2. Deploy frontend to Vercel
3. Update backend `FRONTEND_URL` with Vercel URL

### 6.3 Test the Application
1. Visit your Vercel URL
2. Try registering a new account
3. Check if emails are being sent
4. Test the chat functionality

## 🔧 Step 7: Custom Domain (Optional)

### 7.1 Backend Custom Domain (Render)
1. Go to Render dashboard
2. Select your service
3. Go to "Settings" → "Custom Domains"
4. Add your domain

### 7.2 Frontend Custom Domain (Vercel)
1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your domain

## 📊 Step 8: Monitoring and Analytics

### 8.1 Render Monitoring
- Check Render dashboard for backend logs
- Monitor resource usage
- Set up alerts for downtime

### 8.2 Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor frontend performance
- Check deployment logs

## 🛠️ Troubleshooting

### Common Issues:

1. **Backend not starting:**
   - Check environment variables
   - Verify MongoDB connection
   - Check Render logs

2. **Frontend can't connect to backend:**
   - Verify `VITE_API_URL` is correct
   - Check CORS settings
   - Ensure backend is running

3. **Email not sending:**
   - Verify Gmail app password
   - Check SMTP settings
   - Test with a simple email first

4. **Database connection issues:**
   - Verify MongoDB connection string
   - Check IP whitelist
   - Ensure database user has correct permissions

## 📈 Performance Optimization

### Backend Optimizations:
- Enable gzip compression
- Set up Redis for caching (optional)
- Monitor database queries
- Use connection pooling

### Frontend Optimizations:
- Enable Vercel's edge functions
- Use CDN for static assets
- Implement lazy loading
- Optimize images

## 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate keys regularly

2. **Database Security:**
   - Use strong passwords
   - Limit IP access
   - Enable encryption

3. **API Security:**
   - Implement rate limiting
   - Use HTTPS only
   - Validate all inputs

## 📞 Support

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables
3. Test each service individually
4. Check the GitHub repository for updates

---

**🎉 Congratulations!** Your AndroMind AI application should now be live and accessible to users worldwide!
