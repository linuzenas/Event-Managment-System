// Admin Events Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    checkAdminAuth();
    
    // Setup admin profile
    setupAdminProfile();
    
    // Load events
    loadEvents();
    
    // Setup event listeners
    setupEventListeners();
    
    // Check if we need to edit or create a new event (from URL parameter)
    checkUrlParams();
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
}

// Load events from localStorage
function loadEvents(filters = {}) {
    const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
    const eventsTableBody = document.getElementById('eventsTableBody');
    
    if (eventsData.length === 0) {
        eventsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">No events found. Add your first event using the button above.</td>
            </tr>
        `;
        return;
    }
    
    // Apply filters
    let filteredEvents = [...eventsData];
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.status === filters.status);
    }
    
    // Type filter
    if (filters.type && filters.type !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.type === filters.type);
    }
    
    // Search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm) ||
            event.organizer.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort events by date (newest first)
    filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate table rows
    const eventsHTML = filteredEvents.map(event => {
        // Calculate event date info
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
            <tr>
                <td>
                    <div class="event-name-cell">
                        <div class="event-title">${event.title}</div>
                        <div class="event-organizer">${event.organizer}</div>
                    </div>
                </td>
                <td>
                    ${formatDate(event.date)}<br>
                    <span class="event-time">${event.time}</span>
                    <div class="event-day-info">${dateInfo}</div>
                </td>
                <td>${event.location}</td>
                <td><span class="event-type-badge">${formatType(event.type)}</span></td>
                <td><span class="event-status ${event.status}">${formatStatus(event.status)}</span></td>
                <td>
                    <div class="event-actions">
                        <button class="action-btn edit-btn" data-id="${event.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${event.id}" title="Delete">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <a href="events.html" target="_blank" class="action-btn view-btn" title="View on site">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    eventsTableBody.innerHTML = eventsHTML || `
        <tr>
            <td colspan="6" class="empty-message">No events match your filters.</td>
        </tr>
    `;
}

// Setup event listeners
function setupEventListeners() {
    // Add event button
    document.getElementById('addEventBtn').addEventListener('click', () => {
        openEventModal();
    });
    
    // Close event modal
    document.getElementById('closeEventModal').addEventListener('click', () => {
        closeEventModal();
    });
    
    // Cancel event form
    document.getElementById('cancelEventBtn').addEventListener('click', () => {
        closeEventModal();
    });
    
    // Save event
    document.getElementById('saveEventBtn').addEventListener('click', () => {
        saveEvent();
    });
    
    // Filter events
    document.getElementById('eventStatusFilter').addEventListener('change', applyFilters);
    document.getElementById('eventTypeFilter').addEventListener('change', applyFilters);
    document.getElementById('eventSearchInput').addEventListener('input', applyFilters);
    
    // Event delegation for edit and delete buttons
    document.getElementById('eventsTableBody').addEventListener('click', (e) => {
        // Edit button
        if (e.target.closest('.edit-btn')) {
            const eventId = e.target.closest('.edit-btn').dataset.id;
            openEventModal(eventId);
        }
        
        // Delete button
        if (e.target.closest('.delete-btn')) {
            const eventId = e.target.closest('.delete-btn').dataset.id;
            openDeleteModal(eventId);
        }
    });
    
    // Delete modal events
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteEvent);
    
    // Form submission handling to prevent default
    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveEvent();
    });
}

// Open event modal (for add or edit)
function openEventModal(eventId = null) {
    const modal = document.getElementById('eventFormModal');
    const formTitle = document.getElementById('eventFormTitle');
    const form = document.getElementById('eventForm');
    
    // Clear the form
    form.reset();
    
    if (eventId) {
        // Edit mode
        formTitle.textContent = 'Edit Event';
        
        // Find the event
        const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
        const event = eventsData.find(e => e.id.toString() === eventId.toString());
        
        if (event) {
            // Populate the form
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDescription').value = event.description;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventTime').value = formatTimeForInput(event.time);
            document.getElementById('eventLocation').value = event.location;
            document.getElementById('eventType').value = event.type;
            document.getElementById('eventStatus').value = event.status;
            document.getElementById('eventImage').value = event.image;
            document.getElementById('eventOrganizer').value = event.organizer;
            document.getElementById('eventRegistrationDeadline').value = event.registrationDeadline;
            document.getElementById('eventCapacity').value = event.capacity;
        }
    } else {
        // Add mode
        formTitle.textContent = 'Add New Event';
        document.getElementById('eventId').value = '';
        
        // Set default values
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Set default date as tomorrow
        document.getElementById('eventDate').value = formatDateForInput(tomorrow);
        
        // Set default registration deadline as today
        document.getElementById('eventRegistrationDeadline').value = formatDateForInput(today);
        
        // Default capacity
        document.getElementById('eventCapacity').value = 100;
        
        // Default status
        document.getElementById('eventStatus').value = 'upcoming';
    }
    
    // Show modal
    modal.classList.add('active');
    
    // Focus on the first input field
    document.getElementById('eventTitle').focus();
}

// Close event modal
function closeEventModal() {
    const modal = document.getElementById('eventFormModal');
    modal.classList.remove('active');
    
    // Update the URL to remove any edit parameters
    window.history.replaceState({}, document.title, window.location.pathname);
}

// Save event
function saveEvent() {
    // Get form data
    const eventId = document.getElementById('eventId').value;
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const location = document.getElementById('eventLocation').value;
    const type = document.getElementById('eventType').value;
    const status = document.getElementById('eventStatus').value;
    const image = document.getElementById('eventImage').value || `https://source.unsplash.com/random/800x600/?${type}`;
    const organizer = document.getElementById('eventOrganizer').value;
    const registrationDeadline = document.getElementById('eventRegistrationDeadline').value;
    const capacity = document.getElementById('eventCapacity').value;
    
    // Validate form
    if (!title || !description || !date || !time || !location || !type || !status || !organizer || !registrationDeadline || !capacity) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Get events data
    let eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
    
    // Format time for display
    const formattedTime = formatTimeForDisplay(time);
    
    if (eventId) {
        // Update existing event
        const index = eventsData.findIndex(e => e.id.toString() === eventId.toString());
        
        if (index !== -1) {
            eventsData[index] = {
                ...eventsData[index],
                title,
                description,
                date,
                time: formattedTime,
                location,
                type,
                status,
                image,
                organizer,
                registrationDeadline,
                capacity: parseInt(capacity),
            };
        }
    } else {
        // Add new event
        const newId = eventsData.length > 0 ? Math.max(...eventsData.map(e => e.id)) + 1 : 1;
        
        eventsData.push({
            id: newId,
            title,
            description,
            date,
            time: formattedTime,
            location,
            type,
            status,
            image,
            organizer,
            registrationDeadline,
            capacity: parseInt(capacity),
            registered: 0
        });
    }
    
    // Save to localStorage
    localStorage.setItem('eventsData', JSON.stringify(eventsData));
    
    // Show success message
    showToast(eventId ? 'Event updated successfully!' : 'Event created successfully!');
    
    // Close modal
    closeEventModal();
    
    // Reload events
    loadEvents(getFilters());
}

// Show toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
        
        // Add CSS for the toast
        const style = document.createElement('style');
        style.textContent = `
            #toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: #6a11cb;
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
            }
            #toast.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Open delete confirmation modal
function openDeleteModal(eventId) {
    const modal = document.getElementById('deleteConfirmModal');
    document.getElementById('deleteEventId').value = eventId;
    modal.classList.add('active');
}

// Close delete confirmation modal
function closeDeleteModal() {
    const modal = document.getElementById('deleteConfirmModal');
    modal.classList.remove('active');
}

// Delete event
function deleteEvent() {
    const eventId = document.getElementById('deleteEventId').value;
    
    // Get events data
    let eventsData = JSON.parse(localStorage.getItem('eventsData')) || [];
    
    // Remove the event
    eventsData = eventsData.filter(e => e.id.toString() !== eventId.toString());
    
    // Save to localStorage
    localStorage.setItem('eventsData', JSON.stringify(eventsData));
    
    // Show success message
    showToast('Event deleted successfully!');
    
    // Close modal
    closeDeleteModal();
    
    // Reload events
    loadEvents(getFilters());
}

// Apply filters
function applyFilters() {
    loadEvents(getFilters());
}

// Get current filters
function getFilters() {
    return {
        status: document.getElementById('eventStatusFilter').value,
        type: document.getElementById('eventTypeFilter').value,
        search: document.getElementById('eventSearchInput').value
    };
}

// Check if we need to edit or create a new event (from URL parameter)
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const isNew = urlParams.get('new') === 'true';
    
    if (editId) {
        openEventModal(editId);
    } else if (isNew) {
        openEventModal();
    }
}

// Helper functions
function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatTimeForInput(timeString) {
    // Convert "09:00 AM" format to "09:00" for input
    if (!timeString) return '';
    
    let [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    
    // Convert 12-hour to 24-hour format
    if (period === 'PM' && hours !== '12') {
        hours = parseInt(hours) + 12;
    } else if (period === 'AM' && hours === '12') {
        hours = '00';
    }
    
    return `${hours}:${minutes}`;
}

function formatTimeForDisplay(timeString) {
    // Convert "09:00" format to "09:00 AM" for display
    if (!timeString) return '';
    
    let [hours, minutes] = timeString.split(':');
    let period = 'AM';
    
    // Convert 24-hour to 12-hour format
    if (parseInt(hours) >= 12) {
        period = 'PM';
        if (parseInt(hours) > 12) {
            hours = (parseInt(hours) - 12).toString().padStart(2, '0');
        }
    } else if (hours === '00') {
        hours = '12';
    }
    
    return `${hours}:${minutes} ${period}`;
} 