# AndroMind-AI

A modern, full-featured ChatGPT clone built with React, Node.js, and MongoDB. Features include user authentication, real-time chat, password strength indicators, legal pages, and a beautiful responsive UI.

## 🚀 Features

### Authentication & Security
- **User Registration & Login** with email verification
- **Password Strength Indicator** with real-time validation
- **Forgot Password** with OTP verification
- **JWT Authentication** with refresh tokens
- **Secure Password Reset** flow

### Chat Interface
- **Real-time Chat** with AI responses
- **Message History** with persistent storage
- **Typing Indicators** and loading states
- **Message Export** and copy functionality
- **Chat Management** (create, delete, rename)

### UI/UX
- **Responsive Design** for mobile and desktop
- **Dark Theme** with glass morphism effects
- **Smooth Animations** with Framer Motion
- **Mobile-First** approach
- **Accessibility** features

### Legal & Compliance
- **Terms and Conditions** page
- **Privacy Policy** page
- **GDPR Compliant** content
- **User Agreement** integration

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Hook Form** with Zod validation
- **React Markdown** for message rendering
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Nodemailer** for email services
- **Express Validator** for input validation
- **Rate Limiting** for security
- **CORS** configuration

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/VijayChCode/AndroMind-AI.git
   cd AndroMind-AI
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Frontend dependencies
   cd frontend
   npm install
   
   # Backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=AndroMind AI
   VITE_APP_VERSION=1.0.0
   ```
   
   **Backend (.env)**
   ```env
   MONGODB_URI=mongodb://localhost:27017/andromind-ai
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_REFRESH_EXPIRES_IN=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start Development Servers**
   ```bash
   # Start backend (from root directory)
   npm run dev:backend
   
   # Start frontend (from root directory)
   npm run dev:frontend
   ```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` (your backend URL)
   - `VITE_APP_NAME`
   - `VITE_APP_VERSION`
3. Deploy automatically on push

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `SMTP_*` variables
   - `CORS_ORIGIN`
3. Deploy automatically on push

### Database (MongoDB Atlas)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Set up database access and network access
4. Get your connection string
5. Update `MONGODB_URI` in your backend environment

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Mobile phones** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large screens** (1440px+)

## 🔒 Security Features

- **Password Strength Validation**
- **JWT Token Authentication**
- **Rate Limiting**
- **Input Validation**
- **CORS Protection**
- **Secure Email Verification**
- **OTP-based Password Reset**

## 📄 Legal Pages

- **Terms and Conditions** - Comprehensive legal terms
- **Privacy Policy** - GDPR-compliant privacy information
- **User Agreement** - Integrated into signup flow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for inspiration
- React and Node.js communities
- All open-source contributors

## 📞 Support

For support, email support@andromind-ai.com or create an issue on GitHub.

---

**Made with ❤️ by VijayChCode**