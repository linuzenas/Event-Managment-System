// Mock data for clubs
const clubsData = [
    {
        id: 1,
        name: 'Coding Blocks',
        type: 'technical',
        description: 'A community of programming enthusiasts who love to code and learn together.',
        image: 'https://tse2.mm.bing.net/th/id/OIP.uTjprifUXA6iPy67bh9bnQHaHa?rs=1&pid=ImgDetMain',
        members: 35,
        events: 15,
               
    },
    {
        id: 2,
        name: 'Microsoft Learn Student Chapter',
        type: 'technical',
        description: 'Explore the world of AI and automation through hands-on projects.',
        image: 'https://tse1.mm.bing.net/th/id/OIP.UsSBRA1rzgAT1ISTkBg7mgHaHa?rs=1&pid=ImgDetMain',
        members: 15,
        events: 5,
       
    },
    {
        id: 3,
        name: 'Vishaka Club',
        type: 'cultural',
        description: 'Express yourself through art, music, dance, and theatre.',
        image: 'https://tse3.mm.bing.net/th/id/OIP.k-TH6R3CjyPMuGKvVTdHGwHaNJ?rs=1&pid=ImgDetMain',
        members: 150,
        events: 30,
        
    },
    {
        id: 4,
        name: 'Yuva Tourism Club',
        type: 'cultural',
        description: 'Express yourself through art, music, dance, and theatre.',
        image: 'https://tse2.mm.bing.net/th/id/OIP.CpGN7VzdU8naYR7R6LA9ngHaH6?w=188&h=200&c=7&r=0&o=5&dpr=2&pid=1.7',
        members: 150,
        events: 30,
       
    },
    {
        id: 5,
        name: 'Google Developer Group',
        type: 'Technical',
        description: 'Explore the world of AI and automation through hands-on projects.',
        image: 'https://tse1.mm.bing.net/th/id/OIP.aglLZhcy2jBqdlE_odpEcQHaEK?w=300&h=180&c=7&r=0&o=5&dpr=2&pid=1.7',
        members: 150,
        events: 30,
        
    },
    {
        id: 6,
        name: 'ACM-W KARE',
        type: 'techincal',
        description: 'Explore the world of AI and automation through hands-on projects.',
        image: 'https://tse2.mm.bing.net/th/id/OIP.rm4cRHVOvUs1GTH7tavDOgHaEo?rs=1&pid=ImgDetMain',
        members: 200,
        events: 40,
        
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupUserProfile();
    renderClubs('all');
    setupSearchAndFilters();
});

// Render clubs based on filter
function renderClubs(filter) {
    const clubsGrid = document.getElementById('clubsGrid');
    const filteredClubs = filter === 'all' 
        ? clubsData 
        : clubsData.filter(club => club.type === filter);

    clubsGrid.innerHTML = filteredClubs.map(club => `
        <div class="club-card" data-type="${club.type}">
            <div class="club-image">
                <img src="${club.image}" alt="${club.name}">
            </div>
            <div class="club-content">
                <span class="club-type">${formatType(club.type)}</span>
                <h3 class="club-title">${club.name}</h3>
                <p class="club-description">${club.description}</p>
                <div class="club-stats">
                    <div class="club-stat">
                        <i class="fas fa-users"></i>
                        <span>${club.members} members</span>
                    </div>
                    <div class="club-stat">
                        <i class="fas fa-calendar"></i>
                        <span>${club.events} events</span>
                    </div>
                </div>
                <div class="club-actions">
                    <a href="club-details.html?id=${club.id}" class="club-btn primary">View Details</a>
                    <button class="club-btn secondary" onclick="joinClub(${club.id})">Join</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup search and filters
function setupSearchAndFilters() {
    // Search functionality
    const searchInput = document.getElementById('clubSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const clubs = document.querySelectorAll('.club-card');
        
        clubs.forEach(club => {
            const title = club.querySelector('.club-title').textContent.toLowerCase();
            const description = club.querySelector('.club-description').textContent.toLowerCase();
            const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);
            club.style.display = shouldShow ? 'block' : 'none';
        });
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderClubs(button.dataset.filter);
        });
    });
}

// Helper functions
function formatType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function joinClub(clubId) {
    // Add join club functionality
    alert('Club join feature coming soon!');
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