// app.js - Main application logic

// Global variables
let heroButton;
let pricingButtons;
let videoFilterButtons;
let gameButtons;

// Check login state on load
window.addEventListener('DOMContentLoaded', () => {
    // First, clear any stored login if needed (for testing)
    // localStorage.removeItem('loggedInUser');
    
    // Reset UI state to show homepage by default
    document.querySelector('.dashboard').style.display = 'none';
    document.querySelector('.navbar').style.display = 'flex';
    document.querySelector('.footer').style.display = 'block';
    document.querySelectorAll('section:not(.imp)').forEach(section => {
        if (!section.classList.contains('section')) {
            section.style.display = 'block';
        }
    });
    
    // Only proceed to dashboard if explicitly logged in and login is verified
    const loggedInUser = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (loggedInUser && users.some(u => u.email === loggedInUser)) {
        showDashboard();
    }
    
    // Initialize action buttons
    initButtons();
    initDashboardNav();
    initVideoFilters();
});

// Initialize buttons
function initButtons() {
    // Hero button
    heroButton = document.getElementById('heroBtn');
    if (heroButton) {
        heroButton.addEventListener('click', () => {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (loggedInUser) {
                showDashboard();
                document.getElementById('testBtn').click();
            } else {
                document.querySelector('.imp').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Pricing buttons
    pricingButtons = document.querySelectorAll('.pricing-button');
    pricingButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.imp').classList.add('active');
            document.body.style.overflow = 'hidden';
            document.getElementById('showSignupBtn').click();
        });
    });

    // Game buttons
    gameButtons = document.querySelectorAll('.play-btn');
    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Game functionality coming soon! Stay tuned for interactive learning experiences.');
        });
    });

    // Video play buttons
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            alert('Video content will be available in the full version of CareerPath Mentor!');
        });
    });
}

// Show dashboard interface
function showDashboard() {
    document.querySelector('.dashboard').style.display = 'flex';
    document.querySelector('.navbar').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    document.querySelectorAll('section:not(.imp)').forEach(section => {
        if (!section.classList.contains('section')) {
            section.style.display = 'none';
        }
    });
    
    // Get email of logged in user
    const email = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.email === email);
    
    if (currentUser) {
        // Update profile section with user data
        const profileInfo = document.getElementById('profile-info');
        if (profileInfo) {
            updateProfileWithRecommendation();
        }
        
        // Update dashboard header
        const userDisplayName = document.getElementById('username-display');
        const userDisplayEmail = document.getElementById('email-display');
        
        if (userDisplayName) userDisplayName.textContent = currentUser.name.split(' ')[0];
        if (userDisplayEmail) userDisplayEmail.textContent = currentUser.email;
    }
    
    // Make profile section visible by default
    showSection('profileSection');
}

// Initialize dashboard navigation
function initDashboardNav() {
    document.getElementById('profileBtn')?.addEventListener('click', () => {
        showSection('profileSection');
    });

    document.getElementById('testBtn')?.addEventListener('click', () => {
        showSection('testSection');
    });

    document.getElementById('professionsBtn')?.addEventListener('click', () => {
        showSection('professionsSection');
    });
    
    document.getElementById('videosBtn')?.addEventListener('click', () => {
        showSection('videosSection');
    });
    
    document.getElementById('gamesBtn')?.addEventListener('click', () => {
        showSection('gamesSection');
    });
    
    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        // Remove the logged in user from localStorage
        localStorage.removeItem('loggedInUser');
        
        // Show homepage
        document.querySelector('.dashboard').style.display = 'none';
        document.querySelector('.navbar').style.display = 'flex';
        document.querySelector('.footer').style.display = 'block';
        document.querySelectorAll('section:not(.imp)').forEach(section => {
            if (!section.classList.contains('section')) {
                section.style.display = 'block';
            }
        });
    });
}

// Initialize video filters
function initVideoFilters() {
    // Dashboard video filters
    const videoFilters = document.querySelectorAll('.video-filter');
    videoFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            videoFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            filter.classList.add('active');
            
            // Get filter value
            const filterValue = filter.getAttribute('data-filter');
            
            // Filter videos
            const videos = document.querySelectorAll('.video-card');
            videos.forEach(video => {
                const category = video.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    video.style.display = 'block';
                } else {
                    video.style.display = 'none';
                }
            });
        });
    });

    // Homepage video filters
    videoFilterButtons = document.querySelectorAll('.filter-btn');
    videoFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            videoFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter videos
            const videos = document.querySelectorAll('.video-card');
            videos.forEach(video => {
                const category = video.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    video.style.display = 'block';
                } else {
                    video.style.display = 'none';
                }
            });
        });
    });
}

// Show the specified section in the dashboard
function showSection(id) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(id);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    
    // Add active class to the corresponding nav button
    const buttonId = id.replace('Section', 'Btn');
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('active');
    }
}

// Update profile section with test results
function updateProfileWithRecommendation() {
    const email = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) return;
    
    const profileInfo = document.getElementById('profile-info');
    const testCompleted = localStorage.getItem('testCompleted') === 'true';
    const analysisResults = JSON.parse(localStorage.getItem('analysisResults') || '{}');
    
    if (testCompleted && analysisResults.topProfession) {
        profileInfo.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-details">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    ${user.phone ? `<p>${user.phone}</p>` : ''}
                </div>
            </div>
            
            <div class="profile-recommendation">
                <h3>Your Career Recommendation</h3>
                <p>Based on your personality assessment, you would be best suited for a career as a <span class="profession">${analysisResults.topProfession.title}</span>.</p>
                <p>${analysisResults.topProfession.description}</p>
                
                <h4>Your Dominant Traits</h4>
                <div class="traits-container">
                    ${analysisResults.dominantTraits.map(trait => 
                        `<span class="trait-badge">${capitalizeFirstLetter(trait)}</span>`
                    ).join('')}
                </div>
                
                <p class="mt-4">${analysisResults.traitSummary || ''}</p>
                
                <button class="btn" onclick="document.getElementById('professionsBtn').click()">
                    <i class="fas fa-search mr-2"></i> Explore All Professions
                </button>
            </div>
        `;
    } else {
        profileInfo.innerHTML = `
            <div class="profile-card">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-details">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                    ${user.phone ? `<p>${user.phone}</p>` : ''}
                </div>
            </div>
            
            <div class="profile-recommendation">
                <h3>Take the Personality Test</h3>
                <p>Complete our detailed personality assessment to get personalized career recommendations that match your traits and abilities.</p>
                <button class="btn" onclick="document.getElementById('testBtn').click()">Start Test Now</button>
            </div>
        `;
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}