@echo off
echo 🚀 Setting up AndroMind AI...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

REM Create environment file if it doesn't exist
if not exist backend\.env (
    echo 📝 Creating environment file...
    copy backend\env.example backend\.env
    echo ⚠️  Please edit backend\.env and add your OpenAI API key
)

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Edit backend\.env and add your OpenAI API key (optional)
echo 2. Run 'npm run dev' to start the development servers
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
pause
