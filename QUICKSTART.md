# Quick Start Guide - FreeMovieWatchers Login System

## Overview
This guide will help you set up and run the complete OAuth login system for FreeMovieWatchers with Google and Apple authentication support.

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A code editor (VS Code, etc.)
- A terminal/command line

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║  FreeMovieWatchers Auth Server         ║
║  Running on http://localhost:3000       ║
║  Environment: development               ║
╚════════════════════════════════════════╝

Test credentials:
  Email: test@example.com
  Password: password123
```

### Step 4: Test the Login Page
1. Open `login.html` in your browser
2. Try logging in with:
   - **Email**: test@example.com
   - **Password**: password123

That's it! The login system is now running. 🎉

---

## 🔐 Testing All Features

### Test Email/Password Login
```
Email: test@example.com
Password: password123
```

### Test Google Sign-In
Click the "Sign in with Google" button → Uses mock data for development

### Test Apple Sign-In
Click the "Sign in with Apple" button → Uses mock data for development

---

## 📁 Project Structure
```
FreeMovieWatchers.inc/
├── login.html              # Login page
├── styles/
│   └── login.css           # Login page styles
├── scripts/
│   └── login.js            # Frontend JavaScript
├── backend/
│   ├── server.js           # Express.js server
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment template
└── OAUTH_SETUP.md          # Detailed OAuth setup
```

---

## 🔑 Available API Endpoints

### Login Endpoints

**POST /api/auth/login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**POST /api/auth/register**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","name":"New User"}'
```

**POST /api/auth/google**
```bash
curl -X POST http://localhost:3000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"JWT_TOKEN_HERE"}'
```

**POST /api/auth/apple**
```bash
curl -X POST http://localhost:3000/api/auth/apple \
  -H "Content-Type: application/json" \
  -d '{"token":"JWT_TOKEN_HERE","user":{"name":"John Doe","email":"john@example.com"}}'
```

### Verification Endpoints

**POST /api/auth/verify**
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**GET /api/auth/profile**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**GET /api/health**
```bash
curl http://localhost:3000/api/health
```

---

## 🛠️ Development Tips

### Enable Auto-Reload
Install `nodemon` for automatic server restart on file changes:
```bash
npm install --save-dev nodemon
```

Then update `package.json` scripts:
```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

Run with: `npm run dev`

### View Console Logs
Open browser DevTools (F12) → Console tab to see authentication logs

### Check Backend Logs
Watch the terminal where you ran `npm start` for server logs

---

## 🔄 Frontend/Backend Communication

1. **User enters credentials** → Login form validates input
2. **Frontend sends request** → `/api/auth/login` endpoint
3. **Backend processes request** → Validates user, creates JWT token
4. **Token returned to frontend** → Stored in `localStorage`
5. **User redirected** → To `/dashboard.html` (create this page)

---

## 📝 Next Steps

### Create a Dashboard Page
Create a `dashboard.html` file:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>Welcome!</h1>
    <p id="userInfo"></p>
    
    <script>
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('userInfo').textContent = 
                `Hello, ${user.name}!`;
        }
    </script>
</body>
</html>
```

### Add Real OAuth Credentials
See `OAUTH_SETUP.md` for instructions on setting up real Google and Apple OAuth.

### Switch to Real Database
Replace the in-memory user storage with MongoDB or PostgreSQL.

---

## ❓ Troubleshooting

### "Cannot GET /login.html"
- Make sure you're opening `login.html` directly in your browser
- Or set up a simple HTTP server: `npx http-server`

### "Cannot connect to http://localhost:3000"
- Make sure the backend server is running
- Check that port 3000 is not in use
- Try a different port: `PORT=5000 npm start`

### "User not found" error
- Use the test credentials: `test@example.com` / `password123`
- Or register a new user with the `/api/auth/register` endpoint

### CORS errors
- The backend CORS is configured for `http://localhost:3000`
- To test from a different domain, add it to `allowedOrigins` in `backend/server.js`

---

## 📚 Learn More

- [OAuth 2.0 Concepts](https://auth0.com/intro-to-iam/what-is-oauth-2)
- [JWT Authentication](https://jwt.io/introduction)
- [Express.js Documentation](https://expressjs.com/)
- [Google OAuth Setup](OAUTH_SETUP.md#google-oauth-setup)
- [Apple OAuth Setup](OAUTH_SETUP.md#apple-oauth-setup)

---

## 💬 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `OAUTH_SETUP.md` for OAuth-specific issues
3. Check browser console for error messages
4. Review server logs in the terminal

Happy coding! 🎉
