// Mock data for clubs
const clubsData = {
    1: {
        name: 'Coding Club',
        description: 'A community of programming enthusiasts who love to code and learn together.',
        activities: [
            'Weekly coding challenges',
            'Hackathons',
            'Technical workshops',
            'Project collaborations'
        ],
        achievements: [
            'Won inter-college coding competition 2023',
            'Successfully organized 5 hackathons',
            'Conducted 20+ workshops'
        ],
        contactInfo: {
            email: 'coding.club@kare.ac.in',
            faculty: 'Dr. John Doe'
        }
    },
    // Add more clubs as needed
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeClubDetails();
    initializeTabs();
});

function initializeClubDetails() {
    // Get club ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = urlParams.get('id');

    // Fetch club details (replace with your actual data fetching logic)
    const clubDetails = getClubDetails(clubId);
    
    if (!clubDetails) {
        window.location.href = 'clubs.html';
        return;
    }

    // Populate club information
    document.getElementById('clubCoverImage').style.backgroundImage = `url(${clubDetails.coverImage})`;
    document.getElementById('clubLogo').style.backgroundImage = `url(${clubDetails.logo})`;
    document.getElementById('clubName').textContent = clubDetails.name;
    document.getElementById('clubDescription').textContent = clubDetails.description;
    document.getElementById('memberCount').textContent = clubDetails.memberCount;
    document.getElementById('foundedDate').textContent = clubDetails.foundedDate;
    
    // Populate meeting details
    document.getElementById('meetingTime').textContent = clubDetails.meetingSchedule;
    document.getElementById('meetingVenue').textContent = clubDetails.venue;

    // Populate faculty coordinator
    document.getElementById('facultyCoordinator').innerHTML = `
        <div class="coordinator-card">
            <img src="${clubDetails.facultyCoordinator.image}" alt="${clubDetails.facultyCoordinator.name}" class="coordinator-avatar">
            <div class="coordinator-info">
                <h4>${clubDetails.facultyCoordinator.name}</h4>
                <p>${clubDetails.facultyCoordinator.department}</p>
            </div>
        </div>
    `;

    // Populate student leaders
    document.getElementById('studentLeaders').innerHTML = clubDetails.studentLeaders.map(leader => `
        <div class="leader-card">
            <img src="${leader.image}" alt="${leader.name}" class="leader-avatar">
            <div class="leader-info">
                <h4>${leader.name}</h4>
                <p>${leader.role}</p>
            </div>
        </div>
    `).join('');

    // Load events
    loadClubEvents(clubDetails.events);
    
    // Load members
    loadClubMembers(clubDetails.members);

    // Update social links
    updateSocialLinks(clubDetails.socialLinks);

    // Add this after other initializations
    renderAchievements(clubDetails.achievements);
}

function loadClubEvents(events) {
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
    const pastEvents = events.filter(event => new Date(event.date) <= new Date());

    document.getElementById('upcomingEvents').innerHTML = upcomingEvents.map(event => `
        <div class="event-card">
            <div class="event-image" style="background-image: url(${event.image})">
                <span class="event-date">${formatDate(event.date)}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-info">
                    <span><i class="fas fa-location-dot"></i> ${event.venue}</span>
                    <span><i class="fas fa-clock"></i> ${event.time}</span>
                </div>
                <button class="btn primary" onclick="registerForEvent(${event.id})">Register Now</button>
            </div>
        </div>
    `).join('');

    document.getElementById('pastEvents').innerHTML = pastEvents.map(event => `
        <div class="event-card">
            <div class="event-image" style="background-image: url(${event.image})">
                <span class="event-date">${formatDate(event.date)}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="event-info">
                    <span><i class="fas fa-location-dot"></i> ${event.venue}</span>
                    <span><i class="fas fa-clock"></i> ${event.time}</span>
                </div>
                <button class="btn secondary" onclick="viewEventDetails(${event.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

function loadClubMembers(members) {
    // Make sure we display exactly 5 members
    const displayMembers = members.slice(0, 5);
    
    document.getElementById('membersGrid').innerHTML = displayMembers.map(member => `
        <div class="member-card">
            <img src="${member.image}" alt="${member.name}" class="member-avatar">
            <h4>${member.name}</h4>
            <p>${member.department}, ${member.year}</p>
            <span class="member-role">${member.role}</span>
        </div>
    `).join('');
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
}

// Helper functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function registerForEvent(eventId) {
    // Implement event registration logic
    console.log('Registering for event:', eventId);
}

// Mock function to get club details - replace with actual data fetching
function getClubDetails(clubId) {
    // Return mock data structure
    return {
        id: clubId,
        name: "Coding Blocks KARE",
        description: "A community of programming enthusiasts",
        coverImage: "https://tse2.mm.bing.net/th/id/OIP.uTjprifUXA6iPy67bh9bnQHaHa?rs=1&pid=ImgDetMain",
        logo: "https://tse2.mm.bing.net/th/id/OIP.uTjprifUXA6iPy67bh9bnQHaHa?rs=1&pid=ImgDetMain",
        memberCount: 20,
        foundedDate: "January 2023",
        meetingSchedule: "Saturday, 9:30 AM",
        venue: "8th Block Seminar Hall",
        facultyCoordinator: {
            name: "Dr.R.Sundar Rajan",
            department: "Information Technology",
            image: ""
        },
        achievements: [
            {
                title: "INNOVATE KARE [24hrs Hackathon]",
                description: "We got 65 team registrations in just 45 minutes",
                date: "March 2025",
                icon: "fa-trophy"
            },
            {
                title: "CODESOLO [Euphoria]",
                description: "The Survival Challenge - Test Your Limits!",
                date: "March 2025",
                icon: "fa-award"
            },
            {
                title: "Successful Workshop Series [Reactify]",
                description: "Conducted 1 credit course technical workshops reaching over 500 students",
                date: "2025-03-22",
                icon: "fa-chalkboard-teacher"
            },
            {
                title: "Industry Collaboration",
                description: "Collabrated with EVER Code and many more companies",
                date: "",
                icon: "fa-handshake"
            },
            {
                title: "Open Source Contributions",
                description: "Club members contributed to 5 major open source projects",
                date: "2024-2025",
                icon: "fa-code-branch"
            },
        ],
        studentLeaders: [
            {
                name: "Busa Deepak",
                role: "President",
                image: "https://tse4.mm.bing.net/th/id/OIP.qzzk_JN3YhrXUQA_mTsYBQAAAA?w=322&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
            },
            // Add more leaders...
        ],
        events: [
            {
                id: 1,
                title: "Reactify",
                date: "2025-03-22",
                time: "9:00 AM",
                venue: "9th Block Seminar Hall",
                description: "Learn advanced programming concepts",
                image: "Images/Reactify.jpg"
            },
            // Add more events...
            {
                id: 2,
                title: "INNOVATE KARE [24hrs Hackathon]",
                date: "2024-03-08",
                time: "9:30 AM",
                venue: "8th Block Seminar Hall",
                description: "Design, Develop, And Deploy",
                image: "Images/CBHck.jpg"
            },
            {
                id: 3,
                title: "CODESOLO [Euphoria]",
                date: "2025-03-13",
                time: "9:00 AM",
                venue: "Labs 8307 & 8205",
                description: "The survival Code Challenge - Test Your Limits",
                image: "Images/Codesolo.jpg"
            },
        ],
        activities: [
            {
                date: "01-11-2025",
                title: "Hackathon",
                description: "Build-A-Bot - 24-hour coding competition",
                images: ["Images\Hack.jpg"]
            },
            // Add more activities...
        ],
        members: [
            {
                name: "Busa Deepak",
                department: "IT",
                year: "3rd Year",
                image: "https://tse4.mm.bing.net/th/id/OIP.qzzk_JN3YhrXUQA_mTsYBQAAAA?w=322&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
                role: "President"
            },
            // Add more members...
            {
                name: "Jaswanth",
                department: "IT",
                year: "3rd Year",
                image: "https://tse4.mm.bing.net/th/id/OIP.qzzk_JN3YhrXUQA_mTsYBQAAAA?w=322&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
                role: "Vice President"
            },
            
        ],
        socialLinks: {
            linkedin: "https://www.linkedin.com/company/your-club",
            whatsapp: "https://chat.whatsapp.com/your-group-link" // or phone number
        }
    };
}

// Load club details
function loadClubDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const clubId = parseInt(urlParams.get('id'));
    
    // Find club in mock data
    const club = clubsData.find(c => c.id === clubId);
    
    if (!club) {
        showError('Club not found');
        return;
    }

    // Update page title
    document.title = `${club.name} - KARE SPHERE`;

    // Render main club details
    renderClubDetails(club);
    
    // Render sections
    renderActivities(club.activities);
    renderAchievements(club.achievements);
    renderUpcomingEvents(club);
    renderContactInfo(club.contactInfo);
}

function renderClubDetails(club) {
    const detailsContainer = document.getElementById('clubDetails');
    detailsContainer.innerHTML = `
        <div class="club-hero">
            <div class="club-hero-image">
                <img src="${club.image}" alt="${club.name}">
            </div>
            <div class="club-hero-content">
                <span class="club-type">${formatType(club.type)}</span>
                <h1>${club.name}</h1>
                <p class="club-description">${club.description}</p>
                <div class="club-stats">
                    <div class="stat">
                        <i class="fas fa-users"></i>
                        <span>${club.members}</span>
                        <label>Members</label>
                    </div>
                    <div class="stat">
                        <i class="fas fa-calendar"></i>
                        <span>${club.events}</span>
                        <label>Events</label>
                    </div>
                </div>
                <div class="club-actions">
                    <button class="club-btn primary" onclick="joinClub(${club.id})">
                        Join Club
                    </button>
                    <button class="club-btn secondary" onclick="shareClub(${club.id})">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderActivities(activities) {
    const container = document.getElementById('clubActivities');
    container.innerHTML = `
        <ul class="activities-list">
            ${activities.map(activity => `
                <li>
                    <i class="fas fa-check-circle"></i>
                    <span>${activity}</span>
                </li>
            `).join('')}
        </ul>
    `;
}

function renderAchievements(achievements) {
    const achievementsGrid = document.querySelector('.achievements-grid');
    if (!achievementsGrid) return;

    achievementsGrid.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
            <i class="fas ${achievement.icon}"></i>
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
            <span class="achievement-date">${achievement.date}</span>
        </div>
    `).join('');
}

function renderUpcomingEvents(club) {
    // Mock upcoming events data
    const upcomingEvents = [
        {
            title: 'Weekly Meetup',
            date: '2024-03-01',
            time: '4:00 PM',
            location: 'Lab 201'
        },
        {
            title: 'Workshop',
            date: '2024-03-15',
            time: '2:00 PM',
            location: 'Main Auditorium'
        }
    ];

    const container = document.getElementById('clubEvents');
    container.innerHTML = `
        <div class="events-list">
            ${upcomingEvents.map(event => `
                <div class="event-item">
                    <div class="event-date">
                        <span class="date">${formatDate(event.date)}</span>
                        <span class="time">${event.time}</span>
                    </div>
                    <div class="event-info">
                        <h4>${event.title}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    </div>
                    <button class="event-btn" onclick="registerForEvent('${event.title}')">
                        Register
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderContactInfo(contactInfo) {
    const container = document.getElementById('clubContact');
    container.innerHTML = `
        <div class="contact-info">
            <div class="contact-item">
                <i class="fas fa-user"></i>
                <div>
                    <label>Faculty Coordinator</label>
                    <p>${contactInfo.faculty}</p>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <div>
                    <label>Email</label>
                    <p>${contactInfo.email}</p>
                </div>
            </div>
        </div>
    `;
}

// Helper functions
function formatType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showError(message) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="error-message">
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="clubs.html" class="btn primary">Back to Clubs</a>
        </div>
    `;
}

// Action functions
function joinClub(clubId) {
    alert('Club join feature coming soon!');
}

function shareClub(clubId) {
    // Implement share functionality
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        alert('Share feature not supported on this browser');
    }
}

function registerForEvent(eventTitle) {
    alert(`Registration for "${eventTitle}" coming soon!`);
}

// User profile setup
function setupUserProfile() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));

    if (userInfo && profileData) {
        document.getElementById('userProfilePic').src = profileData.basicInfo.profilePicture || userInfo.picture;
        document.getElementById('userName').textContent = profileData.basicInfo.fullName;
    }
}

function updateSocialLinks(socialLinks) {
    const linkedinLink = document.getElementById('linkedinLink');
    const whatsappLink = document.getElementById('whatsappLink');

    if (socialLinks.linkedin) {
        linkedinLink.href = socialLinks.linkedin;
    } else {
        linkedinLink.style.display = 'none';
    }

    if (socialLinks.whatsapp) {
        // Format WhatsApp link with proper URL scheme
        const whatsappUrl = socialLinks.whatsapp.startsWith('https://') 
            ? socialLinks.whatsapp 
            : `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`;
        whatsappLink.href = whatsappUrl;
    } else {
        whatsappLink.style.display = 'none';
    }
} 