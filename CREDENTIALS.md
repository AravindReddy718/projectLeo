# HMC Login Credentials - STABLE & WORKING! ✅

## 🚀 Both Servers Running Without Crashes

### 📱 Frontend
- **URL**: http://localhost:5173
- **Status**: ✅ Running Stable
- **Framework**: Vite + React

### 🔧 Backend API  
- **URL**: http://localhost:8000
- **Status**: ✅ Running Stable (No more crashes!)
- **Framework**: Express.js
- **API Docs**: http://localhost:8000/api

## 👤 Test Users (All Working)

### Student Login
- **Email**: student@iit.ac.in
- **Password**: password123
- **Role**: student
- **Redirects to**: /student/dashboard

### Warden Login  
- **Email**: warden@iit.ac.in
- **Password**: password123
- **Role**: warden
- **Redirects to**: /warden/dashboard

### Admin Login
- **Email**: admin@iit.ac.in  
- **Password**: password123
- **Role**: admin
- **Redirects to**: /admin/dashboard

## 🧪 How to Test (Now Working!)

1. **Open Browser**: Go to http://localhost:5173
2. **Navigate to Login**: Click login or go to /login
3. **Enter Credentials**: Use any of the accounts above
4. **Success**: You should be redirected to the correct dashboard

## ✅ Issues Fixed
- ✅ **Backend crashes resolved** - Switched from nodemon to direct node
- ✅ **Port conflicts resolved** - Backend on 8000, Frontend on 5173
- ✅ **Frontend-backend connection working** - API calls tested
- ✅ **Authentication flow working** - JWT tokens generating
- ✅ **CORS configured correctly** - Cross-origin requests working
- ✅ **Empty component files fixed** - All components implemented

## 🔧 Technical Details
- Backend now uses `node server.js` instead of `nodemon` for stability
- Backend running on port 8000 to avoid all conflicts
- JWT tokens expire in 7 days
- Frontend stores tokens in localStorage
- Mock authentication for testing (MongoDB temporarily disabled)

**Last Updated**: Both servers confirmed stable at 17:22

## 🚀 Quick Start Commands
```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```
