# 🚀 ONE-CLICK DEPLOYMENT GUIDE

## ✅ Your app is 100% ready to deploy!

---

## 🎯 EASIEST OPTION: Render.com (5 Minutes)

### Why Render?
- ✅ 100% FREE (750 hours/month)
- ✅ Automatic PostgreSQL database included
- ✅ One-click deploy from GitHub
- ✅ Auto HTTPS
- ✅ No credit card needed

---

## 📋 DEPLOYMENT STEPS:

### 1. Go to Render
Open: https://render.com

### 2. Sign Up
- Click "Get Started"
- Choose "Sign up with GitHub"
- Authorize Render

### 3. Deploy Blueprint
- Click "New +" → "Blueprint"
- Connect your repository: `shyam-kale/sales-lead-management-system`
- Render will automatically detect `render.yaml`
- Click "Apply"

### 4. Wait 5-10 Minutes
- Render will:
  - Create PostgreSQL database
  - Build Docker image
  - Deploy your app
  - Setup HTTPS

### 5. Done! 🎉
Your app will be live at:
```
https://sales-lead-system.onrender.com
```

---

## 🔄 Alternative: Manual Deployment on Render

If Blueprint doesn't work:

### Step 1: Create Database
1. Dashboard → "New +" → "PostgreSQL"
2. Name: `sales-lead-db`
3. Plan: Free
4. Click "Create Database"
5. Wait 2 minutes
6. Copy "Internal Database URL"

### Step 2: Create Web Service
1. Dashboard → "New +" → "Web Service"
2. Connect repository: `shyam-kale/sales-lead-management-system`
3. Configure:
   - Name: `sales-lead-system`
   - Region: Singapore (or closest)
   - Branch: `main`
   - Root Directory: `backend`
   - Environment: `Docker`
   - Dockerfile Path: `backend/Dockerfile`
   - Plan: Free

### Step 3: Add Environment Variables
Click "Advanced" → Add these:

```
PORT=8080
DATABASE_URL=<paste Internal Database URL>
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DDL_AUTO=update
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait 10 minutes for first build

---

## 🎯 ALTERNATIVE: Railway.app (Also Easy)

### 1. Go to Railway
Open: https://railway.app

### 2. Sign Up
- Click "Login"
- Choose "Login with GitHub"

### 3. New Project
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Select: `shyam-kale/sales-lead-management-system`

### 4. Add Database
- Click "New" → "Database" → "Add PostgreSQL"
- Railway auto-connects it

### 5. Configure Service
- Click on your service
- Settings → Change these:
  - Root Directory: `backend`
  - Build Command: (leave empty, Docker auto-detected)
  - Start Command: (leave empty)

### 6. Add Variables
Go to "Variables" tab, add:
```
PORT=8080
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DDL_AUTO=update
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
```

Railway auto-adds DATABASE_URL from PostgreSQL

### 7. Deploy
- Click "Deploy"
- Get URL from "Settings" → "Domains"

---

## 🎯 ALTERNATIVE: Koyeb (100% Free Forever)

### 1. Setup Database First
Use Railway just for database:
- Go to https://railway.app
- New Project → Add PostgreSQL
- Copy connection details

### 2. Deploy on Koyeb
- Go to https://www.koyeb.com
- Sign up with GitHub
- New App → GitHub
- Repository: `shyam-kale/sales-lead-management-system`
- Builder: Docker
- Dockerfile: `backend/Dockerfile`
- Context: `backend`
- Port: 8080

### 3. Add Environment Variables
```
DATABASE_URL=jdbc:postgresql://HOST:PORT/DATABASE
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
DATABASE_DRIVER=org.postgresql.Driver
HIBERNATE_DDL_AUTO=update
HIBERNATE_DIALECT=org.hibernate.dialect.PostgreSQLDialect
PORT=8080
```

---

## ✅ RECOMMENDED: Use Render Blueprint

The easiest way is Render Blueprint (Step 3 in first section).
It automatically:
- Creates database
- Configures environment
- Deploys app
- Sets up domain

**Just click "Apply" and wait!**

---

## 🆘 Troubleshooting

### Build Failed?
- Check Dockerfile path: `backend/Dockerfile`
- Ensure root directory: `backend`

### Database Error?
- Wait 2 minutes after database creation
- Check DATABASE_URL is set
- Verify HIBERNATE_DIALECT matches database type

### App Not Loading?
- Wait 5 minutes after "Live" status
- Check logs in dashboard
- Verify PORT=8080

---

## 📱 After Deployment

Your CRM will be accessible at:
- Render: `https://sales-lead-system.onrender.com`
- Railway: `https://sales-lead-system.up.railway.app`
- Koyeb: `https://sales-lead-system.koyeb.app`

**Share with your team and start managing leads!** 🎉

---

## 🔄 Auto-Deploy

Any push to GitHub main branch will auto-deploy:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Platform will rebuild and redeploy automatically!

---

## 💡 Which Platform to Choose?

| Platform | Database | Ease | Speed | Uptime |
|----------|----------|------|-------|--------|
| **Render** | ✅ Included | ⭐⭐⭐⭐⭐ | Fast | Good |
| **Railway** | ✅ Included | ⭐⭐⭐⭐ | Fast | Excellent |
| **Koyeb** | ❌ Separate | ⭐⭐⭐ | Fast | Good |

**Recommendation: Start with Render Blueprint** - Easiest one-click deploy!

