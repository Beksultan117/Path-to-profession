// auth.js - Authentication functionality

// Initialize authentication components
document.addEventListener('DOMContentLoaded', function() {
    // Get authentication elements
    const authContainer = document.querySelector('.imp');
    const closeAuthBtn = document.querySelector('.close-auth');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupBtn = document.getElementById('showSignupBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const signInBtn = document.querySelector('.sign_in_btn');
    const signUpBtn = document.querySelector('.sign_up_btn');
    const signInLink = document.getElementById('signInLink');
    const startTestBtn = document.getElementById('startTestBtn');

    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Show auth modal events
    signInLink?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal();
    });

    startTestBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openAuthModal();
    });

    // Close auth modal
    closeAuthBtn?.addEventListener('click', () => {
        closeAuthModal();
    });

    // Switch between login and signup forms
    showSignupBtn?.addEventListener('click', () => {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    });

    showLoginBtn?.addEventListener('click', () => {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Handle form submissions
    signInBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogin();
    });

    signUpBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        handleSignup();
    });

    // Also close modal when clicking outside
    authContainer?.addEventListener('click', (e) => {
        if (e.target === authContainer) {
            closeAuthModal();
        }
    });
});

// Open auth modal
function openAuthModal() {
    const authContainer = document.querySelector('.imp');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
    authContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close auth modal
function closeAuthModal() {
    const authContainer = document.querySelector('.imp');
    authContainer.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle login form submission
function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find matching user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set logged in status
        localStorage.setItem('loggedInUser', email);
        
        // Show dashboard
        closeAuthModal();
        showDashboard();
    } else {
        alert('Invalid email or password');
    }
}

// Handle signup form submission
function handleSignup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('newpassword').value;
    const phone = document.getElementById('phone').value;
    
    // Basic validation
    if (!name || !email || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user with email already exists
    if (users.some(u => u.email === email)) {
        alert('An account with this email already exists');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password, phone };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set logged in status
    localStorage.setItem('loggedInUser', email);
    
    // Show dashboard
    closeAuthModal();
    showDashboard();
}

// Update UI based on logged in state
function updateUI() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        // Show dashboard
        showDashboard();
    } else {
        // Show homepage
        document.querySelector('.dashboard').style.display = 'none';
        document.querySelector('.navbar').style.display = 'flex';
        document.querySelector('.footer').style.display = 'block';
    }
}