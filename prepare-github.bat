@echo off
echo 🚀 Preparing Sales Lead Management System for GitHub Upload
echo ==========================================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Check repository status
echo 📋 Checking repository status...
git status

REM Add all files
echo 📦 Adding all files to Git...
git add .

REM Show what will be committed
echo 📝 Files to be committed:
git status --short

REM Create initial commit
echo 💾 Creating initial commit...
git commit -m "feat: initial commit - complete sales lead management system

🎯 Features:
- Modern full-stack application with Java Spring Boot backend
- React frontend with 2026-style UI and glassmorphism effects  
- MySQL database with comprehensive schema
- Advanced analytics and reporting features
- User profile and settings management
- Complete CRUD operations for leads and deals
- Interactive charts and data visualization
- Responsive design for all devices

🛠 Tech Stack:
- Backend: Java 17, Spring Boot 3, MySQL 8
- Frontend: React 18, Vite, Modern CSS
- Database: Advanced MySQL schema with relationships
- UI/UX: Glassmorphism, Animated Gradients, Responsive Design

📊 Components:
- Dashboard with real-time analytics
- Lead management with scoring
- Deal pipeline with revenue tracking
- Advanced reporting system
- User management and settings
- Activity tracking and audit logs"

echo.
echo ✅ Repository prepared for GitHub upload!
echo.
echo 🔗 Next Steps:
echo 1. Create a new repository on GitHub named: sales-lead-management-system
echo 2. Copy this description for GitHub:
echo.
echo    🚀 Modern Sales Lead ^& Deal Pipeline Management System with Advanced Analytics, Beautiful 2026-Style UI, and MySQL Integration
echo.
echo 3. Run these commands to upload:
echo    git remote add origin https://github.com/YOUR_USERNAME/sales-lead-management-system.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Add these topics to your GitHub repository:
echo    sales-management, crm, lead-management, deal-pipeline, spring-boot, react, mysql, analytics, dashboard, java, javascript, full-stack, business-application, modern-ui, glassmorphism
echo.
echo 📖 See GITHUB_SETUP.md for detailed instructions!
echo.
echo 🎉 Your professional sales management system is ready for GitHub!
pause