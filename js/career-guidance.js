// Career roadmaps data
const roadmaps = [
    {
        title: 'Web Development',
        paths: [
            {
                name: 'Frontend Development',
                steps: [
                    'HTML, CSS, JavaScript basics',
                    'Modern JavaScript (ES6+)',
                    'React/Next.js',
                    'State Management',
                    'Testing & Deployment'
                ]
            },
            {
                name: 'Backend Development',
                steps: [
                    'Programming Language (Python/Node.js)',
                    'Databases (SQL/NoSQL)',
                    'APIs & REST',
                    'Server Management',
                    'Security & Authentication'
                ]
            }
        ]
    },
    {
        title: 'Data Science',
        paths: [
            {
                name: 'Data Analysis',
                steps: [
                    'Statistics & Mathematics',
                    'Python for Data Analysis',
                    'Data Visualization',
                    'Machine Learning Basics',
                    'Big Data Tools'
                ]
            }
        ]
    },
    {
        title: 'Cybersecurity',
        paths: [
            {
                name: 'Security Analyst',
                steps: [
                    'Network Fundamentals',
                    'Security Protocols',
                    'Penetration Testing',
                    'Security Tools',
                    'Incident Response'
                ]
            }
        ]
    }
];

// Render roadmaps
function renderRoadmaps() {
    const container = document.getElementById('roadmapsContainer');
    
    const roadmapsHTML = roadmaps.map(roadmap => `
        <div class="roadmap">
            <h2>${roadmap.title}</h2>
            ${roadmap.paths.map(path => `
                <div class="card">
                    <h3>${path.name}</h3>
                    <ul class="roadmap-steps">
                        ${path.steps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
    `).join('');

    container.innerHTML = roadmapsHTML;
}

// Schedule consultation function
function scheduleConsultation() {
    alert('This feature is coming soon! Please check back later.');
}

// Sample counselor data - In production, this would come from your backend
const counselors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Career Planning & Development",
        image: "images/counselors/sarah.jpg",
        availability: {
            // Define available time slots
        }
    },
    {
        id: 2,
        name: "Prof. Michael Chen",
        specialty: "Technical Career Guidance",
        image: "images/counselors/michael.jpg",
        availability: {
            // Define available time slots
        }
    },
    {
        id: 3,
        name: "Dr. Priya Sharma",
        specialty: "Higher Education & Research",
        image: "images/counselors/priya.jpg",
        availability: {
            // Define available time slots
        }
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeCareerGuidance();
    setupSearch();
    setupFilters();
});

function initializeCareerGuidance() {
    // Populate career paths
    const careerPaths = [
        {
            title: 'Software Development',
            description: 'Build and maintain software applications',
            growth: '22%',
            salary: '₹8L/year',
            skills: ['Programming', 'Problem Solving', 'Web Development']
        },
        // Add more career paths...
    ];

    renderCareerPaths(careerPaths);
    renderRoadmaps();
}

function setupSearch() {
    const searchInput = document.getElementById('careerSearch');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterCareerPaths(searchTerm);
    });
}

function setupFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            filterCareersByType(tag.dataset.filter);
        });
    });
}

function renderCareerPaths(careers) {
    const careerGrid = document.getElementById('careerGrid');
    careerGrid.innerHTML = careers.map(career => `
        <div class="career-card" data-type="${career.type}">
            <h3>${career.title}</h3>
            <p>${career.description}</p>
            <div class="career-stats">
                <span><i class="fas fa-chart-line"></i> ${career.growth} Growth</span>
                <span><i class="fas fa-money-bill-wave"></i> ${career.salary}</span>
            </div>
            <div class="career-tags">
                ${career.skills.map(skill => `
                    <span class="career-tag">${skill}</span>
                `).join('')}
            </div>
            <button class="learn-more-btn" onclick="window.location.href='career-details.html?path=${career.title}'">
                Learn More
            </button>
        </div>
    `).join('');
}

function filterCareerPaths(searchTerm) {
    const cards = document.querySelectorAll('.career-card');
    cards.forEach(card => {
        const content = card.textContent.toLowerCase();
        card.style.display = content.includes(searchTerm) ? 'block' : 'none';
    });
}

function filterCareersByType(type) {
    const cards = document.querySelectorAll('.career-card');
    cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Load counselors into the preview section
function loadCounselors() {
    const counselorList = document.getElementById('counselorList');
    const counselorSelect = document.getElementById('counselorSelect');
    
    if (counselorList) {
        counselorList.innerHTML = counselors.map(counselor => `
            <div class="counselor-card">
                <img src="${counselor.image}" alt="${counselor.name}" class="counselor-image">
                <div class="counselor-name">${counselor.name}</div>
                <div class="counselor-specialty">${counselor.specialty}</div>
            </div>
        `).join('');
    }

    if (counselorSelect) {
        counselorSelect.innerHTML = `
            <option value="">Select Counselor</option>
            ${counselors.map(counselor => `
                <option value="${counselor.id}">${counselor.name} - ${counselor.specialty}</option>
            `).join('')}
        `;
    }
}

// Modal functions
function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'flex';
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'none';
}

// Initialize the scheduling system
function initializeSchedulingSystem() {
    const consultationForm = document.getElementById('consultationForm');
    const consultationDate = document.getElementById('consultationDate');
    const consultationTime = document.getElementById('consultationTime');

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    consultationDate.min = tomorrow.toISOString().split('T')[0];

    // Set maximum date to 30 days from now
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    consultationDate.max = maxDate.toISOString().split('T')[0];

    // Update time slots when date changes
    consultationDate.addEventListener('change', updateTimeSlots);

    // Handle form submission
    consultationForm.addEventListener('submit', handleConsultationSubmit);
}

// Update available time slots based on date selection
function updateTimeSlots() {
    const timeSelect = document.getElementById('consultationTime');
    const selectedDate = document.getElementById('consultationDate').value;
    
    // In production, you would fetch available slots from your backend
    const timeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM",
        "02:00 PM", "03:00 PM", "04:00 PM"
    ];

    timeSelect.innerHTML = `
        <option value="">Select Time Slot</option>
        ${timeSlots.map(time => `
            <option value="${time}">${time}</option>
        `).join('')}
    `;
}

// Handle form submission
function handleConsultationSubmit(event) {
    event.preventDefault();

    const formData = {
        counselorId: document.getElementById('counselorSelect').value,
        consultationType: document.getElementById('consultationType').value,
        date: document.getElementById('consultationDate').value,
        time: document.getElementById('consultationTime').value,
        notes: document.getElementById('consultationNotes').value
    };

    // In production, you would send this data to your backend
    console.log('Consultation booking:', formData);

    // Show success message
    showSuccessMessage();

    // Close modal after delay
    setTimeout(() => {
        closeScheduleModal();
        // Reset form
        event.target.reset();
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const modalBody = document.querySelector('.modal-body');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Consultation scheduled successfully! Check your email for confirmation.
    `;
    modalBody.appendChild(successMessage);
}