// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    checkAdminAuth();
    
    // Setup admin profile
    setupAdminProfile();
    
    // Load event statistics
    loadEventStatistics();
    
    // Load recent events
    loadRecentEvents();
});

// Setup admin profile in navigation
function setupAdminProfile() {
    const adminInfo = JSON.parse(sessionStorage.getItem('adminInfo'));
    
    if (!adminInfo) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Update profile picture
    document.getElementById('adminProfilePic').src = adminInfo.picture;
    
    // Update admin name in navbar
    document.getElementById('adminName').textContent = adminInfo.name;
    
    // Update welcome message
    document.getElementById('adminWelcomeName').textContent = adminInfo.name.split(' ')[0];
}

// Load event statistics
function loadEventStatistics() {
    // In a real app, this would fetch from your backend
    // For now, we'll use the mock events data from localStorage or create it if it doesn't exist
    
    let eventsData = JSON.parse(localStorage.getItem('eventsData'));
    
    if (!eventsData) {
        // Use the mock data from events.js as fallback
        eventsData = [
            {
                id: 1,
                title: 'Tech Symposium 2024',
                description: 'Annual technical symposium featuring workshops, competitions, and guest lectures.',
                date: '2024-03-15',
                time: '09:00 AM',
                location: 'Main Auditorium',
                type: 'technical',
                status: 'upcoming',
                image: 'https://source.unsplash.com/random/800x600/?technology',
                organizer: 'CSE Department',
                registrationDeadline: '2024-03-10',
                capacity: 500,
                registered: 320
            },
            {
                id: 2,
                title: 'Cultural Fest',
                description: 'Annual cultural festival celebrating art, music, and dance.',
                date: '2024-03-20',
                time: '10:00 AM',
                location: 'College Ground',
                type: 'cultural',
                status: 'upcoming',
                image: 'https://source.unsplash.com/random/800x600/?festival',
                organizer: 'Cultural Club',
                registrationDeadline: '2024-03-15',
                capacity: 1000,
                registered: 750
            },
            {
                id: 3,
                title: 'Coding Competition',
                description: 'Inter-college coding competition with exciting prizes.',
                date: '2024-02-28',
                time: '02:00 PM',
                location: 'Lab Complex',
                type: 'technical',
                status: 'ongoing',
                image: 'https://source.unsplash.com/random/800x600/?coding',
                organizer: 'Coding Club',
                registrationDeadline: '2024-02-25',
                capacity: 200,
                registered: 180
            }
        ];
        
        // Save to localStorage for persistence
        localStorage.setItem('eventsData', JSON.stringify(eventsData));
    }
    
    // Calculate statistics
    const totalEvents = eventsData.length;
    const upcomingEvents = eventsData.filter(event => event.status === 'upcoming').length;
    const ongoingEvents = eventsData.filter(event => event.status === 'ongoing').length;
    
    // Update statistics in the UI with animation
    animateCounter('totalEventsCount', 0, totalEvents);
    animateCounter('upcomingEventsCount', 0, upcomingEvents);
    animateCounter('ongoingEventsCount', 0, ongoingEvents);
}

// Animate counter from start to end value
function animateCounter(elementId, start, end) {
    const element = document.getElementById(elementId);
    const duration = 1000; // animation duration in ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    // Start with the loading indicator
    element.textContent = '...';
    
    // Delay animation start to ensure UI visibility
    setTimeout(() => {
        const timer = setInterval(() => {
            frame++;
            
            // Calculate progress based on easing function
            const progress = frame / totalFrames;
            const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2; // cubic easing
            
            // Calculate current value
            const current = Math.floor(start + easeProgress * (end - start));
            
            // Update element
            element.textContent = current;
            
            // Stop animation when complete
            if (frame === totalFrames) {
                clearInterval(timer);
                element.textContent = end;
            }
        }, frameDuration);
    }, 300);
}

// Load recent events
function loadRecentEvents() {
    const eventsData = JSON.parse(localStorage.getItem('eventsData'));
    const recentEventsList = document.getElementById('recentEventsList');
    
    if (!eventsData || eventsData.length === 0) {
        recentEventsList.innerHTML = '<p class="empty-message">No events found. Create your first event from the Events tab.</p>';
        return;
    }
    
    // Sort events by date (newest first)
    const sortedEvents = [...eventsData].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Take the 5 most recent events
    const recentEvents = sortedEvents.slice(0, 5);
    
    // Generate HTML for recent events
    const recentEventsHTML = recentEvents.map(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const isUpcoming = eventDate > today;
        
        // Calculate days difference
        const diffTime = Math.abs(eventDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Date information
        let dateInfo;
        if (isUpcoming) {
            dateInfo = diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`;
        } else {
            dateInfo = diffDays === 0 ? 'Today' : (diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`);
        }
        
        return `
            <div class="recent-event-item">
                <div class="recent-event-date">
                    ${formatDate(event.date)}
                    <div class="event-day-info">${dateInfo}</div>
                </div>
                <div class="recent-event-details">
                    <h4>${event.title}</h4>
                    <div class="recent-event-meta">
                        <span class="event-status ${event.status}">${formatStatus(event.status)}</span>
                        <span class="event-type-badge">${formatType(event.type)}</span>
                    </div>
                </div>
                <div class="recent-event-actions">
                    <a href="admin-events.html?edit=${event.id}" class="action-link" title="Edit Event">
                        <i class="fas fa-edit"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
    
    recentEventsList.innerHTML = recentEventsHTML;
}

// Helper functions
function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
} 