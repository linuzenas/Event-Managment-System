let currentStep = 1;
const totalSteps = 3;

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Profile setup page initialized");
    
    // Check if user is logged in
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo) {
        window.location.href = '/';
        return;
    }

    // Show first step
    showStep(currentStep);
});

// Function to display a specific step
function showStep(stepNumber) {
    console.log(`Showing step ${stepNumber}`);
    
    // Hide all steps
    document.querySelectorAll('.setup-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(`step${stepNumber}`).style.display = 'block';
    
    // Update step indicator
    document.getElementById('currentStep').textContent = stepNumber;
    
    // Update progress bar (33% per step)
    const progressBar = document.getElementById('setupProgress');
    if (progressBar) {
        progressBar.style.width = `${(stepNumber / totalSteps) * 100}%`;
    }
    
    // Show/hide back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.style.display = stepNumber === 1 ? 'none' : 'inline-block';
    }
    
    // Update current step tracker
    currentStep = stepNumber;
}

// Go to next step
function nextStep() {
    if (validateCurrentStep() && currentStep < totalSteps) {
        showStep(currentStep + 1);
    }
}

// Go to previous step
function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Validate the current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            const fullName = document.getElementById('fullName').value;
            const department = document.getElementById('department').value;
            const year = document.getElementById('year').value;
            
            if (!fullName) {
                showMessage('Please enter your full name', 'error');
                return false;
            }
            if (!department) {
                showMessage('Please select your department', 'error');
                return false;
            }
            if (!year) {
                showMessage('Please select your year of study', 'error');
                return false;
            }
            return true;
            
        case 2:
            const interests = document.querySelectorAll('.interest-tags input:checked');
            if (interests.length === 0) {
                showMessage('Please select at least one interest', 'error');
                return false;
            }
            return true;
            
        case 3:
            // We can make preferences optional
            return true;
            
        default:
            return true;
    }
}

// Complete the profile setup
async function completeSetup() {
    console.log("Complete setup function called");
    
    if (!validateCurrentStep()) {
        return;
    }

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.id) {
        showMessage('User session not found. Please log in again.', 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
        return;
    }

    // Disable the complete button to prevent multiple clicks
    const completeBtn = document.querySelector('.complete-btn');
    if (completeBtn) {
        completeBtn.disabled = true;
        completeBtn.textContent = 'Saving...';
    }

    // Show saving message
    showMessage('Saving your profile...', 'info');

    // Gather profile data
    const profileData = {
        basicInfo: {
            fullName: document.getElementById('fullName').value,
            email: userInfo.email,
            department: document.getElementById('department').value,
            year: document.getElementById('year').value,
            profilePicture: document.getElementById('profileImage').src
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

    console.log("Profile data collected:", profileData);

    // Save to sessionStorage first
    sessionStorage.setItem('profileData', JSON.stringify(profileData));
    
    try {
        // Attempt to save to Supabase
        console.log("Saving to Supabase...");
        const success = await window.dbService.saveProfile(userInfo.id, profileData);
        
        console.log("Supabase save result:", success);
        
        if (!success) {
            console.warn("Supabase save failed, but continuing with sessionStorage data");
            showMessage('Cloud save failed, but your profile has been saved locally.', 'warning');
        }
        
        // Regardless of Supabase result, we proceed
        sessionStorage.setItem('setupSuccess', 'true');
        
        // Delay redirect slightly to allow user to see the message
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error("Error during save:", error);
        showMessage('There was an error saving your profile, but we\'ll continue with local data.', 'error');
        
        // Still redirect after a delay
        sessionStorage.setItem('setupSuccess', 'true');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 2000);
    }
}

// Utility to show messages
function showMessage(message, type = 'info') {
    const messageContainer = document.querySelector('.message-container');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;
        messageContainer.style.display = 'block';
        
        // Auto-hide info messages
        if (type === 'info') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 3000);
        }
    }
}

// Load any previously saved preferences
function loadSavedPreferences() {
    const profileData = sessionStorage.getItem('profileData');
    if (profileData) {
        const data = JSON.parse(profileData);
        
        // Load interests
        if (data.interests) {
            data.interests.forEach(interest => {
                const checkbox = document.querySelector(`input[value="${interest}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.closest('.tag').classList.add('selected');
                }
            });
        }

        // Load content preferences
        if (data.preferences?.contentPreferences) {
            data.preferences.contentPreferences.forEach(pref => {
                const checkbox = document.querySelector(`.preference-options input[value="${pref}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

        // Load notification preferences
        if (data.preferences?.notifications) {
            const { email, events } = data.preferences.notifications;
            document.getElementById('emailNotifications').checked = email;
            document.getElementById('eventReminders').checked = events;
        }
    }
}

// Setup preference handlers
function setupPreferenceHandlers() {
    // Handle preference option clicks
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

    // Handle tag clicks with visual feedback
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const checkbox = tag.querySelector('input');
            checkbox.checked = !checkbox.checked;
            tag.classList.toggle('selected', checkbox.checked);
        });
    });
}

// Handle profile picture upload
function setupProfilePictureUpload() {
    const preview = document.getElementById('picturePreview');
    const input = document.getElementById('profilePicture');
    const image = document.getElementById('profileImage');

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

// Update progress indicator (if you have one)
function updateProgressIndicator(step) {
    const indicators = document.querySelectorAll('.progress-indicator .step');
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            if (index < step) {
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('completed');
            }
            
            if (index === step - 1) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Profile setup page loaded");
    
    // Check if we have a stored step and restore it
    const savedStep = sessionStorage.getItem('profileSetupStep');
    currentStep = savedStep ? parseInt(savedStep) : 1;
    
    // Show the current step
    showStep(currentStep);
    
    // Setup event listeners for tag selection
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
    
    // Setup preference option selection
    document.querySelectorAll('.preference-option').forEach(option => {
        option.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
    
    // Setup switch toggle display
    document.querySelectorAll('.switch input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const switchLabel = this.closest('.switch');
            if (this.checked) {
                switchLabel.classList.add('active');
            } else {
                switchLabel.classList.remove('active');
            }
        });
    });
}); 