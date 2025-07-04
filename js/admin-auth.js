// Admin authentication with Google Sign-In
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in as admin
    const adminInfo = JSON.parse(sessionStorage.getItem('adminInfo') || 'null');
    if (adminInfo && window.location.pathname.endsWith('admin-login.html')) {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: '1048859318092-ikf792r4l9mb4ctobr6m5h6velfevote.apps.googleusercontent.com',
        callback: handleAdminCredentialResponse
    });

    // Render the Google Sign-In button
    google.accounts.id.renderButton(
        document.getElementById('adminGoogleSignIn'),
        { theme: 'outline', size: 'large', shape: 'rectangular', width: 350, text: 'signin_with' }
    );
});

// List of admin emails with access permissions
const ADMIN_EMAILS = [
    '9923008040@klu.ac.in',
    // Add more admin emails as needed
];

// Handle the Google Sign-In response for admin
function handleAdminCredentialResponse(response) {
    // Show loading state
    document.querySelector('.admin-login-form').innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Signing in...</p>
        </div>
    `;

    // Verify and decode the credential
    const credential = response.credential;
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    // Check if the email is a KLU email
    if (!payload.email.endsWith('@klu.ac.in')) {
        showAdminError('Please use your KLU email address to sign in.');
        return;
    }
    
    // Check if the email is in the admin list
    if (!ADMIN_EMAILS.includes(payload.email)) {
        showAdminError('You do not have admin privileges. Please contact the system administrator.');
        return;
    }

    // Create admin info object
    const adminInfo = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        token: credential,
        isAdmin: true
    };

    // Store in session
    sessionStorage.setItem('adminInfo', JSON.stringify(adminInfo));

    // Redirect to admin dashboard
    window.location.href = 'admin-dashboard.html';
}

// Show error message for admin login
function showAdminError(message) {
    document.querySelector('.admin-login-form').innerHTML = `
        <div id="adminGoogleSignIn"></div>
        <div id="errorMessage" class="error-message show">${message}</div>
    `;
    
    // Re-render the Google Sign-In button
    google.accounts.id.renderButton(
        document.getElementById('adminGoogleSignIn'),
        { theme: 'outline', size: 'large', shape: 'rectangular', width: 350, text: 'signin_with' }
    );
}

// Admin sign out function
function adminSignOut() {
    // Clear admin session storage
    sessionStorage.removeItem('adminInfo');
    
    // Redirect to admin login page
    window.location.href = 'admin-login.html';
}

// Check admin authentication state
function checkAdminAuth() {
    const adminInfo = sessionStorage.getItem('adminInfo');
    const currentPath = window.location.pathname;

    // If not logged in as admin
    if (!adminInfo) {
        // Redirect to login page if trying to access admin pages
        if (currentPath.includes('admin-') && !currentPath.endsWith('admin-login.html')) {
            window.location.href = 'admin-login.html';
        }
    } else {
        // If logged in but on login page, redirect to dashboard
        if (currentPath.endsWith('admin-login.html')) {
            window.location.href = 'admin-dashboard.html';
        }
    }
} 