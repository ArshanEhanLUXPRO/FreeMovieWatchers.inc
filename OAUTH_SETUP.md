# OAuth Login Setup Guide

This document provides instructions for setting up Google and Apple OAuth authentication for FreeMovieWatchers.

## Table of Contents
1. [Google OAuth Setup](#google-oauth-setup)
2. [Apple OAuth Setup](#apple-oauth-setup)
3. [Backend Integration](#backend-integration)
4. [Testing](#testing)

---

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "FreeMovieWatchers"
3. Enable the Google+ API

### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **Credentials** in the left sidebar
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://arshanehanluxpro.github.io/FreeMovieWatchers.inc/` (for production)
   - `https://yourdomain.com` (your production domain)
5. Copy your **Client ID**

### Step 3: Update login.js

Replace the placeholder in `scripts/login.js`:

```javascript
client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
```

with your actual Google Client ID.

---

## Apple OAuth Setup

### Step 1: Apple Developer Account

1. Enroll in [Apple Developer Program](https://developer.apple.com/programs/)
2. Go to [App IDs](https://developer.apple.com/account/resources/identifiers/list)

### Step 2: Create a Service ID

1. Click **+** to create a new identifier
2. Select **Service IDs**
3. Enter a description and identifier (e.g., `com.freemoviewatchers.app`)
4. Enable **Sign in with Apple**
5. Click **Configure** and set up:
   - Primary App ID
   - Domains and Subdomains: `yourdomain.com`
   - Return URLs: 
     - `https://yourdomain.com/auth/apple/callback`
     - `http://localhost:3000/auth/apple/callback` (for development)

### Step 3: Create a Private Key

1. Go to **Keys** in the App IDs section
2. Click **+** to create a new key
3. Enable **Sign in with Apple**
4. Download the key file and save it securely

### Step 4: Update login.js

Replace the placeholders in `scripts/login.js`:

```javascript
clientId: 'com.freemoviewatchers.app',  // Your Service ID
teamId: 'YOUR_TEAM_ID',                 // Your Apple Team ID
redirectUri: window.location.origin + '/auth/apple/callback',
```

You can find your Team ID at the top right of your Apple Developer account.

---

## Backend Integration

You'll need to implement the following API endpoints on your backend:

### 1. Google Authentication Endpoint

**POST** `/api/auth/google`

```json
Request Body:
{
    "token": "JWT_ID_TOKEN_FROM_GOOGLE"
}

Response:
{
    "success": true,
    "authToken": "YOUR_SESSION_TOKEN",
    "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name"
    }
}
```

**Backend Validation:**
```python
# Example using Python
from google.auth.transport import requests
from google.oauth2 import id_token

CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'

def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        return idinfo
    except ValueError:
        return None
```

### 2. Apple Authentication Endpoint

**POST** `/api/auth/apple`

```json
Request Body:
{
    "token": "IDENTITY_TOKEN_FROM_APPLE",
    "user": {
        "name": "First Last",
        "email": "user@example.com"
    }
}

Response:
{
    "success": true,
    "authToken": "YOUR_SESSION_TOKEN",
    "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "User Name"
    }
}
```

### 3. Email/Password Login Endpoint

**POST** `/api/auth/login`

```json
Request Body:
{
    "email": "user@example.com",
    "password": "password123",
    "rememberMe": true
}

Response:
{
    "success": true,
    "authToken": "YOUR_SESSION_TOKEN",
    "user": {
        "id": "user_id",
        "email": "user@example.com"
    }
}
```

### 4. Token Verification Endpoint

**POST** `/api/auth/verify`

Headers:
```
Authorization: Bearer YOUR_SESSION_TOKEN
```

Response:
```json
{
    "valid": true,
    "user": {
        "id": "user_id",
        "email": "user@example.com"
    }
}
```

---

## Testing

### Local Testing

1. Start your local development server
2. Navigate to `http://localhost:3000/login.html`
3. Test all three login methods:
   - **Google Sign-In**: Click the Google button
   - **Apple Sign-In**: Click the Apple button (requires macOS/iOS)
   - **Email/Password**: Enter test credentials

### Testing Google Sign-In

```javascript
// Add to browser console for debugging
console.log(google.accounts);
```

### Testing Apple Sign-In

Apple Sign-In works best on:
- Safari on macOS or iOS
- Other browsers may show a web fallback

---

## Security Best Practices

1. **Never expose Client Secrets**: Keep Apple private keys and any backend secrets out of frontend code
2. **Validate Tokens on Backend**: Always verify OAuth tokens on your server before creating sessions
3. **Use HTTPS**: All OAuth flows must use HTTPS in production
4. **Set CSRF Tokens**: Implement CSRF protection for your auth endpoints
5. **Secure Session Storage**: Use secure, HttpOnly cookies for session tokens in production
6. **Rate Limiting**: Implement rate limiting on auth endpoints to prevent brute force attacks

---

## Troubleshooting

### Google Sign-In Issues

- **"client_id not specified"**: Make sure you've updated the Client ID in `scripts/login.js`
- **"Redirect URI mismatch"**: Ensure your redirect URIs match exactly in Google Cloud Console
- **"CORS error"**: Google requires the request to come from an authorized domain

### Apple Sign-In Issues

- **"Sign in with Apple not available"**: Ensure you've enabled it in your App ID
- **"Invalid redirect URI"**: Make sure the redirect URI exactly matches what you configured in Apple Developer
- **"teamId undefined"**: Verify you've set the correct Team ID from your Apple Developer account

### CORS Issues

If you encounter CORS errors, make sure:
1. Your backend sets proper CORS headers
2. The frontend is running on an authorized domain
3. OAuth providers are configured with the correct domains

---

## Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign in with Apple Documentation](https://developer.apple.com/sign-in-with-apple/)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)
