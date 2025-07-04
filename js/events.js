// Events JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupUserProfile();
    loadEventsFromStorage();
    setupSearchAndFilters();
    setupViewToggle();
});

// Load events from localStorage
function loadEventsFromStorage() {
    // Try to get events from localStorage (set by admin panel)
    let eventsData = JSON.parse(localStorage.getItem('eventsData'));
    
    // If no events in localStorage, use default mock data
    if (!eventsData || eventsData.length === 0) {
        eventsData = [
            
            
        ];
        
        // Save default data to localStorage
        localStorage.setItem('eventsData', JSON.stringify(eventsData));
    }
    
    // Render events with the data
    renderEvents('all', eventsData);
}

// Render events based on filter
function renderEvents(filter, eventsData) {
    const currentEvents = document.getElementById('currentEvents');
    const upcomingEvents = document.getElementById('upcomingEvents');
    
    // Filter events
    const filteredEvents = filter === 'all' 
        ? eventsData 
        : eventsData.filter(event => event.type === filter || event.status === filter);

    // Separate current and upcoming events
    const current = filteredEvents.filter(event => event.status === 'ongoing');
    const upcoming = filteredEvents.filter(event => event.status === 'upcoming');

    // Render events
    currentEvents.innerHTML = current.map(event => createEventCard(event)).join('') || 
        '<div class="empty-message">No ongoing events found.</div>';
    upcomingEvents.innerHTML = upcoming.map(event => createEventCard(event)).join('') || 
        '<div class="empty-message">No upcoming events found.</div>';
}

function createEventCard(event) {
    const registrationStatus = getRegistrationStatus(event);
    return `
        <div class="event-card ${event.status}" data-type="${event.type}">
            <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
                <span class="event-badge ${event.status}">${formatStatus(event.status)}</span>
            </div>
            <div class="event-content">
                <div class="event-date">
                    <i class="far fa-calendar"></i>
                    ${formatDate(event.date)} at ${event.time}
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-users"></i>
                        <span>${event.registered}/${event.capacity}</span>
                    </div>
                </div>
                <div class="registration-status ${registrationStatus.class}">
                    ${registrationStatus.text}
                </div>
                <div class="event-actions">
                    <button class="event-btn primary" onclick="registerForEvent(${event.id})"
                            ${registrationStatus.disabled ? 'disabled' : ''}>
                        Register Now
                    </button>
                    <button class="event-btn secondary" onclick="viewEventDetails(${event.id})">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Setup search and filters
function setupSearchAndFilters() {
    // Search functionality
    const searchInput = document.getElementById('eventSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const events = document.querySelectorAll('.event-card');
        
        events.forEach(event => {
            const title = event.querySelector('.event-title').textContent.toLowerCase();
            const description = event.querySelector('.event-description').textContent.toLowerCase();
            const shouldShow = title.includes(searchTerm) || description.includes(searchTerm);
            event.style.display = shouldShow ? 'block' : 'none';
        });
    });

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get events data from localStorage
            const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
            renderEvents(button.dataset.filter, eventsData);
        });
    });
}

// Setup view toggle
function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const calendarView = document.getElementById('calendarView');
    const eventsTimeline = document.querySelector('.events-timeline');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (button.dataset.view === 'calendar') {
                eventsTimeline.classList.add('hidden');
                calendarView.classList.remove('hidden');
                renderCalendarView();
            } else {
                eventsTimeline.classList.remove('hidden');
                calendarView.classList.add('hidden');
            }
        });
    });
}

// Helper functions
function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getRegistrationStatus(event) {
    const today = new Date();
    const deadline = new Date(event.registrationDeadline);
    const isFull = event.registered >= event.capacity;

    if (isFull) {
        return {
            text: 'Registration Full',
            class: 'full',
            disabled: true
        };
    }

    if (today > deadline) {
        return {
            text: 'Registration Closed',
            class: 'closed',
            disabled: true
        };
    }

    return {
        text: `Register by ${formatDate(event.registrationDeadline)}`,
        class: 'open',
        disabled: false
    };
}

// Action functions
function registerForEvent(eventId) {
    // Get events data from localStorage
    let eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
    const event = eventsData.find(e => e.id === eventId);
    
    if (event) {
        alert(`Registration for "${event.title}" will be available soon!`);
    }
}

function viewEventDetails(eventId) {
    // Get events data from localStorage
    let eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
    const event = eventsData.find(e => e.id === eventId);
    
    if (event) {
        alert(`Event details for "${event.title}" will be available soon!`);
    }
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