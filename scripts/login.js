// ============================================
// Google OAuth Login (Mock for Development)
// ============================================
function initGoogleSignIn() {
    const googleButton = document.getElementById('googleLoginBtn');
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            // For development: Show Google login modal or redirect
            mockGoogleSignIn();
        });
    }
}

function mockGoogleSignIn() {
    // Create a mock Google auth response
    // In production, you'll use: google.accounts.id.initialize()
    const mockToken = generateMockJWT({
        iss: 'https://accounts.google.com',
        sub: 'google_' + Math.random().toString(36).substr(2, 9),
        email: 'testuser@gmail.com',
        name: 'Google Test User',
        picture: 'https://via.placeholder.com/150',
        aud: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
    });

    handleGoogleSignIn({ credential: mockToken });
}

function handleGoogleSignIn(response) {
    const token = response.credential;
    
    console.log('Google Sign-In successful');
    console.log('ID Token:', token);
    
    // Send the token to your backend for verification
    authenticateWithGoogle(token);
}

function authenticateWithGoogle(token) {
    // Show loading state
    showLoading('Signing in with Google...');

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
        hideLoading();
        if (data.success) {
            // Store auth token and redirect to dashboard
            localStorage.setItem('authToken', data.authToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            showSuccess('Google login successful!');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 500);
        } else {
            showError(data.message || 'Google authentication failed');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        showError('An error occurred during authentication');
    });
}

// ============================================
// Apple OAuth Login (Mock for Development)
// ============================================
function initAppleSignIn() {
    const appleButton = document.getElementById('appleLoginBtn');
    if (appleButton) {
        appleButton.addEventListener('click', function() {
            // For development: Show Apple login modal
            mockAppleSignIn();
        });
    }
}

function mockAppleSignIn() {
    // Create a mock Apple auth response
    const mockToken = generateMockJWT({
        iss: 'https://appleid.apple.com',
        sub: 'apple_' + Math.random().toString(36).substr(2, 9),
        email: 'testuser@icloud.com',
        email_verified: true,
        aud: 'com.freemoviewatchers.app',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
    });

    const mockUser = {
        name: 'Apple Test User',
        email: 'testuser@icloud.com'
    };

    handleAppleSignIn({ 
        detail: {
            user: mockUser,
            authorization: { id_token: mockToken }
        }
    });
}

function handleAppleSignIn(response) {
    const { user, authorization } = response.detail;
    const token = authorization.id_token;
    
    console.log('Apple Sign-In successful');
    console.log('User:', user);
    
    // Send the token to your backend for verification
    authenticateWithApple(token, user);
}

function authenticateWithApple(token, user) {
    // Show loading state
    showLoading('Signing in with Apple...');

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
        hideLoading();
        if (data.success) {
            // Store auth token and redirect to dashboard
            localStorage.setItem('authToken', data.authToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            showSuccess('Apple login successful!');
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 500);
        } else {
            showError(data.message || 'Apple authentication failed');
        }
    })
    .catch(error => {
        hideLoading();
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
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Optionally store email if "Remember me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            showSuccess('Login successful!');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 500);
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

function generateMockJWT(payload) {
    // This is a MOCK JWT for development only
    // Do NOT use in production
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature');
    return `${header}.${body}.${signature}`;
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

function showSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.textContent = message;
    
    // Add styles for success notification
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

function showLoading(message = 'Loading...') {
    // Create loading overlay
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingOverlay';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    `;
    
    loadingDiv.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        ">
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            "></div>
            <p style="color: #333; font-size: 16px; margin: 0;">${message}</p>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loadingOverlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
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

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);