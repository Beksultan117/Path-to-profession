// login.js - Handles authentication modal interaction

// This ensures the Sign In button ALWAYS works
document.addEventListener('click', function(event) {
    // Handle Sign In button (works even if recreated)
    if (event.target.matches('#signInLink, #signInLink *')) {
        event.preventDefault();
        document.querySelector('.imp').classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }

    // Handle modal close
    if (event.target.matches('.close-auth, .close-auth *')) {
        document.querySelector('.imp').classList.remove('active');
        document.body.style.overflow = '';
        return;
    }

    // Handle outside click
    if (event.target === document.querySelector('.imp')) {
        document.querySelector('.imp').classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Form toggling (separate from click handling)
document.getElementById('showSignupBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
});

document.getElementById('showLoginBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
});

// Start Test Button Handler
document.getElementById('startTestBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        // If already logged in, go to test section
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.photos').style.display = 'none';
        document.querySelector('.dashboard').style.display = 'flex';
        document.getElementById('testBtn').click();
    } else {
        // Show login form if not logged in
        document.querySelector('.imp').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
});