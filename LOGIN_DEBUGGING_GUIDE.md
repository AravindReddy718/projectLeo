# Login Debugging Guide

## Quick Checks

### 1. **Backend Server Status**
Make sure your backend server is running:
```bash
cd Backend
npm start
# or
node server.js
```

You should see:
```
🎯 Server running on port 8000
🌐 Health check: http://localhost:8000/api/health
```

**Test the health endpoint:**
Open browser: `http://localhost:8000/api/health`

### 2. **Frontend API Configuration**
Check if frontend is pointing to correct backend:
- File: `frontend/src/services/api.js`
- Should be: `http://localhost:8000/api`
- Or set in `.env` file: `VITE_API_BASE_URL=http://localhost:8000/api`

### 3. **Browser Console Check**
Open Developer Tools (F12) → Console tab
Look for:
- ✅ "Login successful, user: {...}"
- ✅ "User set in AuthContext: {...}"
- ✅ "Navigating to: /student/dashboard"
- ❌ Any red error messages

### 4. **Network Tab Check**
Open Developer Tools (F12) → Network tab
1. Click "Login" button
2. Look for a request to `/api/auth/login`
3. Check:
   - **Status**: Should be `200 OK` (not 401, 404, or 500)
   - **Request Payload**: Should have `email` and `password`
   - **Response**: Should have `token` and `user` object

### 5. **Common Issues & Solutions**

#### Issue: "Network Error" or "Failed to fetch"
**Solution**: Backend server is not running
- Start backend: `cd Backend && npm start`

#### Issue: "401 Unauthorized" or "Invalid credentials"
**Solution**: Wrong email/password
- Test credentials:
  - Email: `student@iit.ac.in`
  - Password: `password123`
- Or create a new user via registration

#### Issue: "404 Not Found" on `/api/auth/login`
**Solution**: Backend route not registered
- Check `Backend/server.js` has: `app.use('/api/auth', authRoutes);`

#### Issue: Login succeeds but redirects back to login
**Solution**: User state not being set correctly
- Check browser console for "User set in AuthContext"
- Check localStorage: `localStorage.getItem('hmc-user')`
- Should contain: `{ user: {...}, token: "..." }`

### 6. **Manual Testing Steps**

1. **Clear browser storage:**
   ```javascript
   // In browser console:
   localStorage.clear()
   sessionStorage.clear()
   ```

2. **Test login API directly:**
   ```javascript
   // In browser console:
   fetch('http://localhost:8000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'student@iit.ac.in',
       password: 'password123'
     })
   })
   .then(r => r.json())
   .then(console.log)
   ```

3. **Check localStorage after login:**
   ```javascript
   // In browser console:
   JSON.parse(localStorage.getItem('hmc-user'))
   ```

### 7. **Database Check**
Make sure you have a user in the database:
- Check MongoDB: `db.users.find({ email: "student@iit.ac.in" })`
- Or register a new user first

### 8. **Environment Variables**
Check `Backend/.env` file has:
```
MONGODB_URI=mongodb://localhost:27017/hmc_database
JWT_SECRET=your-secret-key-here
PORT=8000
```

## Expected Login Flow

1. User enters email/password
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend returns `{ token, user: { id, email, role, ... } }`
5. Frontend stores in localStorage: `{ user, token }`
6. AuthContext sets user state
7. Router redirects to `/${user.role}/dashboard`
8. ProtectedRoute checks authentication
9. Dashboard renders

## Still Having Issues?

Check the console logs - they will show exactly where the flow breaks:
- "Login successful, user: ..." = API call succeeded
- "User set in AuthContext: ..." = State updated
- "Navigating to: ..." = Redirect happening
- "ProtectedRoute check: ..." = Route protection working

