// Get auth instance
const auth = firebase.auth();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Sign in with Google
document.getElementById('googleSignIn').addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // Successful sign in
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Error signing in:', error);
            alert('Error signing in. Please try again.');
        });
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is signed out
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Handle the Google Sign-In response
function handleCredentialResponse(response) {
    // Show loading state
    document.querySelector('.login-box').innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Signing in...</p>
        </div>
    `;

    // Verify and decode the credential
    const credential = response.credential;
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    // Check if the email is from the college domain
    if (!payload.email.endsWith('@klu.ac.in')) {
        document.querySelector('.login-box').innerHTML = `
            <div class="error-message">
                <p>Please use your college email address to sign in.</p>
                <button class="btn primary" onclick="window.location.reload()">Try Again</button>
            </div>
        `;
        return;
    }

    // Create user info object
    const userInfo = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        token: credential
    };

    // Store in session
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Initialize database and attempt to load existing profile
    window.dbService.initDB()
        .then(initialized => {
            if (!initialized) {
                throw new Error('Failed to initialize database');
            }
            return window.dbService.loadProfile(userInfo.id);
        })
        .then(profileData => {
            if (profileData) {
                // Profile exists, redirect to dashboard
                window.location.href = '/dashboard.html';
            } else {
                // No profile, redirect to profile setup
                window.location.href = '/profile-setup.html';
            }
        })
        .catch(error => {
            console.error('Error during sign-in:', error);
            document.querySelector('.login-box').innerHTML = `
                <div class="error-message">
                    <p>An error occurred during sign-in. Please try again.</p>
                    <button class="btn primary" onclick="window.location.reload()">Try Again</button>
                </div>
            `;
        });
}

// Decode the JWT token from Google
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }
}

// Setup user profile in navigation
function setupUserProfile() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));

    if (!userInfo || !profileData) {
        window.location.href = '/';
        return;
    }

    // Update profile picture
    const profilePic = document.getElementById('userProfilePic');
    if (profilePic) {
        profilePic.src = profileData.basicInfo.profilePicture || userInfo.picture;
    }

    // Update user name
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = profileData.basicInfo.fullName;
    }

    // Update department
    const userDepartment = document.getElementById('userDepartment');
    if (userDepartment) {
        const deptMap = {
            'CSE': 'Computer Science',
            'ECE': 'Electronics & Communication',
            'MECH': 'Mechanical Engineering',
            'IT': 'Information Technology',
            'BME': 'Bio-Medical Engineering'
        };
        userDepartment.textContent = deptMap[profileData.basicInfo.department] || profileData.basicInfo.department;
    }
}

// Sign out function
function signOut() {
    // Clear session storage
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('profileData');
    
    // Redirect to login page
    window.location.href = '/';
}

// Check authentication state
function checkAuth() {
    const userInfo = sessionStorage.getItem('userInfo');
    const profileData = sessionStorage.getItem('profileData');
    const currentPath = window.location.pathname;

    if (!userInfo || !profileData) {
        // Not logged in - redirect to login page
        if (currentPath !== '/' && !currentPath.endsWith('index.html')) {
            window.location.href = '/';
        }
    } else {
        // Logged in but on login page - redirect to dashboard
        if (currentPath === '/' || currentPath.endsWith('index.html')) {
            window.location.href = '/dashboard.html';
        }
    }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupUserProfile();
}); 