// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupUserProfile();
    loadProfileData();
    setupProfilePictureUpload();
    setupFormHandlers();
});

// Load profile data
function loadProfileData() {
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (!profileData || !userInfo) {
        window.location.href = '/';
        return;
    }

    // Load basic information
    document.getElementById('fullName').value = profileData.basicInfo.fullName;
    document.getElementById('email').value = userInfo.email;
    document.getElementById('department').value = profileData.basicInfo.department;
    document.getElementById('year').value = profileData.basicInfo.year;
    document.getElementById('profileImagePreview').src = profileData.basicInfo.profilePicture || userInfo.picture;

    // Load interests
    profileData.interests.forEach(interest => {
        const checkbox = document.querySelector(`input[value="${interest}"]`);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.closest('.tag').classList.add('selected');
        }
    });

    // Load content preferences
    if (profileData.preferences?.contentPreferences) {
        profileData.preferences.contentPreferences.forEach(pref => {
            const checkbox = document.querySelector(`.preference-options input[value="${pref}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.preference-option').classList.add('selected');
            }
        });
    }

    // Load notification preferences
    if (profileData.preferences?.notifications) {
        document.getElementById('emailNotifications').checked = profileData.preferences.notifications.email;
        document.getElementById('eventReminders').checked = profileData.preferences.notifications.events;
    }
}

// Setup profile picture upload
function setupProfilePictureUpload() {
    const preview = document.getElementById('picturePreview');
    const input = document.getElementById('profilePicture');
    const image = document.getElementById('profileImagePreview');

    preview.addEventListener('click', () => {
        input.click();
    });

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                image.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Setup form handlers
function setupFormHandlers() {
    // Handle interest tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const checkbox = tag.querySelector('input');
            checkbox.checked = !checkbox.checked;
            tag.classList.toggle('selected', checkbox.checked);
        });
    });

    // Handle preference options
    const preferenceOptions = document.querySelectorAll('.preference-option');
    preferenceOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const checkbox = option.querySelector('input');
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            option.classList.toggle('selected', checkbox.checked);
        });
    });
}

// Save changes
function saveChanges() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.id) {
        showNotification('User session not found. Please log in again.', 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
        return;
    }

    const profileData = {
        basicInfo: {
            fullName: document.getElementById('fullName').value,
            email: userInfo.email,
            department: document.getElementById('department').value,
            year: document.getElementById('year').value,
            profilePicture: document.getElementById('profileImagePreview').src
        },
        interests: {
            technical: Array.from(document.querySelectorAll('.interest-category:first-child .interest-tags input:checked')).map(input => input.value),
            nonTechnical: Array.from(document.querySelectorAll('.interest-category:last-child .interest-tags input:checked')).map(input => input.value)
        },
        preferences: {
            contentPreferences: Array.from(document.querySelectorAll('.preference-options input:checked')).map(input => input.value),
            notifications: {
                email: document.getElementById('emailNotifications').checked,
                events: document.getElementById('eventReminders').checked
            }
        },
        lastUpdated: new Date().toISOString()
    };

    // Validate form
    if (!validateForm(profileData)) {
        return;
    }

    // Show loading indicator
    showNotification('Saving your profile...', 'info');

    // Save to Supabase
    window.dbService.saveProfile(userInfo.id, profileData)
        .then(success => {
            if (success) {
                showNotification('Profile updated successfully!');
                
                // Redirect to previous page or dashboard after short delay
                setTimeout(() => {
                    const returnTo = sessionStorage.getItem('returnTo');
                    window.location.href = returnTo || 'dashboard.html';
                }, 1500);
            } else {
                showNotification('Failed to update profile. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            showNotification('An error occurred while updating profile.', 'error');
        });
}

// Reset form
function resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
        loadProfileData();
    }
}

// Form validation
function validateForm(data) {
    if (!data.basicInfo.fullName.trim()) {
        showNotification('Please enter your full name', 'error');
        return false;
    }

    if (!data.basicInfo.department) {
        showNotification('Please select your department', 'error');
        return false;
    }

    if (!data.basicInfo.year) {
        showNotification('Please select your year of study', 'error');
        return false;
    }

    if (data.interests.technical.length === 0 && data.interests.nonTechnical.length === 0) {
        showNotification('Please select at least one interest', 'error');
        return false;
    }

    return true;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// User profile setup in navigation
function setupUserProfile() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const profileData = JSON.parse(sessionStorage.getItem('profileData'));

    if (userInfo && profileData) {
        document.getElementById('userProfilePic').src = profileData.basicInfo.profilePicture || userInfo.picture;
        document.getElementById('userName').textContent = profileData.basicInfo.fullName;
    }
} 