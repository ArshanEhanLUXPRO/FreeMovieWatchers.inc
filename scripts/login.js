// ============================================
// Google OAuth Login
// ============================================
function initGoogleSignIn() {
    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Client ID
        callback: handleGoogleSignIn
    });

    // Render the Google Sign-In button
    const googleButton = document.getElementById('googleLoginBtn');
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            google.accounts.id.prompt();
        });
    }
}

function handleGoogleSignIn(response) {
    // response.credential contains the JWT
    const token = response.credential;
    
    console.log('Google Sign-In successful');
    console.log('ID Token:', token);
    
    // Send the token to your backend for verification
    authenticateWithGoogle(token);
}

function authenticateWithGoogle(token) {
    // Send token to your backend
    fetch('/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store auth token and redirect to dashboard
            localStorage.setItem('authToken', data.authToken);
            window.location.href = '/dashboard.html';
        } else {
            showError('Google authentication failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during authentication');
    });
}

// ============================================
// Apple OAuth Login
// ============================================
function initAppleSignIn() {
    AppleID.auth.init({
        clientId: 'com.freemoviewatchers.app', // Replace with your Service ID
        teamId: 'YOUR_TEAM_ID', // Replace with your Team ID
        redirectUri: window.location.origin + '/auth/apple/callback',
        scope: 'name email',
        redirectMethod: 'form',
        usePopup: true,
    });

    const appleButton = document.getElementById('appleLoginBtn');
    if (appleButton) {
        appleButton.addEventListener('click', function() {
            AppleID.auth.signIn();
        });
    }
}

// Handle Apple Sign-In response
document.addEventListener('AppleIDSignInOnSuccess', (event) => {
    const user = event.detail.user;
    const identityToken = event.detail.authorization.id_token;
    
    console.log('Apple Sign-In successful');
    console.log('User:', user);
    
    // Send the token to your backend for verification
    authenticateWithApple(identityToken, user);
});

document.addEventListener('AppleIDSignInOnFailure', (event) => {
    console.error('Apple Sign-In failed:', event.detail);
    showError('Apple authentication failed');
});

function authenticateWithApple(token, user) {
    // Send token to your backend
    fetch('/api/auth/apple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            token: token,
            user: user 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store auth token and redirect to dashboard
            localStorage.setItem('authToken', data.authToken);
            window.location.href = '/dashboard.html';
        } else {
            showError('Apple authentication failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('An error occurred during authentication');
    });
}

// ============================================
// Email/Password Login
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const emailLoginForm = document.getElementById('emailLoginForm');
    
    if (emailLoginForm) {
        emailLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailLogin();
        });
    }

    // Initialize OAuth providers
    initGoogleSignIn();
    initAppleSignIn();
});

function handleEmailLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Show loading state
    const loginButton = document.querySelector('.login-button');
    const originalText = loginButton.textContent;
    loginButton.disabled = true;
    loginButton.textContent = 'Signing in...';

    // Send login request to backend
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            rememberMe: rememberMe
        })
    })
    .then(response => response.json())
    .then(data => {
        loginButton.disabled = false;
        loginButton.textContent = originalText;

        if (data.success) {
            // Store auth token
            localStorage.setItem('authToken', data.authToken);
            
            // Optionally store email if "Remember me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } else {
            showError(data.message || 'Login failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loginButton.disabled = false;
        loginButton.textContent = originalText;
        showError('An error occurred. Please try again later.');
    });
}

// ============================================
// Utility Functions
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    
    // Add styles for error notification
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #f44336;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Check if user is already logged in
function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        // Verify token with backend
        fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                // Redirect to dashboard if token is valid
                window.location.href = '/dashboard.html';
            }
        })
        .catch(error => console.error('Auth verification failed:', error));
    }
}

// Pre-fill email if remembered
function prefillRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
}

// Initialize on page load
window.addEventListener('load', function() {
    checkAuthStatus();
    prefillRememberedEmail();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);