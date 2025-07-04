// Mock data for events
const events = [
    { id: 1, title: 'Tech Symposium 2024', date: '2024-03-15', status: 'upcoming' },
    { id: 2, title: 'Cultural Fest', date: '2024-03-20', status: 'upcoming' },
    { id: 3, title: 'Coding Competition', date: '2024-02-28', status: 'ongoing' }
];

// Mock data for clubs
const clubs = [
    { id: 1, name: 'Coding Club', description: 'For programming enthusiasts' },
    { id: 2, name: 'Robotics Club', description: 'Build and learn robotics' },
    { id: 3, name: 'Cultural Club', description: 'Explore arts and culture' }
];

// Render events
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = events.map(event => `
        <div class="card">
            <h3>${event.title}</h3>
            <p>Date: ${event.date}</p>
            <span class="status ${event.status}">${event.status}</span>
        </div>
    `).join('');
}

// Render clubs
function renderClubs() {
    const clubsGrid = document.getElementById('clubsGrid');
    clubsGrid.innerHTML = clubs.map(club => `
        <div class="card">
            <h3>${club.name}</h3>
            <p>${club.description}</p>
            <button class="btn" onclick="window.location.href='club-details.html?id=${club.id}'">
                View Details
            </button>
        </div>
    `).join('');
}

// Sign out functionality
document.getElementById('signOut').addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const userInfo = sessionStorage.getItem('userInfo');
    const profileData = sessionStorage.getItem('profileData');

    if (!userInfo || !profileData) {
        window.location.href = '/';
        return;
    }

    initializeDashboard();
});

function initializeDashboard() {
    setupUserProfile();
    checkWelcomeBanner();
    loadOverviewContent();
}

function loadOverviewContent() {
    loadRecommendations();
    loadEventsPreviews();
    loadClubsPreviews();
    loadCareerPreview();
}

function loadEventsPreviews() {
    // Load only 3 events for preview
    const previewEvents = events.slice(0, 3);
    renderEvents(previewEvents, 'eventsPreviewGrid');
}

function loadClubsPreviews() {
    // Load only 3 clubs for preview
    const previewClubs = clubs.slice(0, 3);
    renderClubs(previewClubs, 'clubsPreviewGrid');
}

function loadCareerPreview() {
    // Load preview of career guidance
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));
    const relevantRoadmaps = getRelevantRoadmaps(profileData.interests).slice(0, 2);
    
    const roadmapPreview = document.getElementById('roadmapPreview');
    roadmapPreview.innerHTML = relevantRoadmaps.map(roadmap => `
        <div class="roadmap-card">
            <h3>${roadmap.title}</h3>
            <p>${roadmap.description}</p>
            <ul>
                ${roadmap.steps.slice(0, 3).map(step => `<li>${step}</li>`).join('')}
            </ul>
            <a href="career-guidance.html#${roadmap.id}" class="btn primary">
                View Full Roadmap
            </a>
        </div>
    `).join('');
}

// Setup user profile in navigation
function setupUserProfile() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));

    if (userInfo && profileData) {
    document.getElementById('userProfilePic').src = profileData.basicInfo.profilePicture || userInfo.picture;
    document.getElementById('userName').textContent = profileData.basicInfo.fullName;
    }
}

// Check and show welcome banner if needed
function checkWelcomeBanner() {
    const setupSuccess = sessionStorage.getItem('setupSuccess');
    if (setupSuccess === 'true') {
        const banner = document.getElementById('welcomeBanner');
        banner.classList.add('show');
        sessionStorage.removeItem('setupSuccess');
    }
}

function dismissWelcome() {
    const banner = document.getElementById('welcomeBanner');
    banner.style.animation = 'slideUp 0.5s ease-out forwards';
    setTimeout(() => banner.remove(), 500);
}

// Load recommended content based on user interests
function loadRecommendations() {
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));
    const interests = profileData.interests;
    const recommendedGrid = document.getElementById('recommendedGrid');

    // Filter events and content based on interests
    const recommendations = getRecommendedContent(interests);
    
    recommendedGrid.innerHTML = recommendations.map(item => `
        <div class="card recommendation-card">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="card-tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button class="btn" onclick="window.location.href='${item.link}'">Learn More</button>
        </div>
    `).join('');
}

// Mock function to get recommended content
function getRecommendedContent(interests) {
    const allContent = {
        'programming': [
            {
                title: 'Coding Workshop',
                description: 'Learn advanced programming concepts',
                tags: ['Technical', 'Workshop'],
                link: '#'
            }
        ],
        'ai-ml': [
            {
                title: 'AI Research Symposium',
                description: 'Latest developments in AI and ML',
                tags: ['Technical', 'Research'],
                link: '#'
            }
        ],
        // Add more content categories
    };

    let recommendations = [];
    interests.forEach(interest => {
        if (allContent[interest]) {
            recommendations = [...recommendations, ...allContent[interest]];
        }
    });

    return recommendations.slice(0, 3); // Return top 3 recommendations
}

// Mock function to get relevant roadmaps
function getRelevantRoadmaps(interests) {
    const allRoadmaps = {
        'programming': {
            id: 'programming',
            title: 'Software Development',
            description: 'Complete roadmap to become a software developer',
            steps: ['Learn programming basics', 'Master data structures', 'Build projects']
        },
        'ai-ml': {
            id: 'ai-ml',
            title: 'AI & Machine Learning',
            description: 'Path to becoming an AI engineer',
            steps: ['Mathematics fundamentals', 'Python programming', 'ML algorithms']
        }
        // Add more roadmaps
    };

    return interests
        .map(interest => allRoadmaps[interest])
        .filter(Boolean)
        .slice(0, 2); // Show top 2 relevant roadmaps
}

// Update the editProfile function
function editProfile() {
    // Store current page URL to return after editing
    sessionStorage.setItem('returnTo', window.location.href);
    // Redirect to profile edit page
    window.location.href = 'profile-edit.html';
}

// Add click handler for the edit profile link
document.addEventListener('DOMContentLoaded', () => {
    const editProfileLink = document.querySelector('[onclick="editProfile()"]');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            editProfile();
        });
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard); 