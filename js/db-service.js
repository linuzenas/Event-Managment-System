// At the top of db-service.js
console.log("Initializing db-service.js");

// Supabase integration for database storage
const SUPABASE_URL = 'https://vxhtsvarzcjxrshdazeh.supabase.co'; // Make sure this is correct
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4aHRzdmFyemNqeHJzaGRhemVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NTg3NTksImV4cCI6MjA1NzAzNDc1OX0.NV3-FnwJAQEAJa5PqAQtgz_r0uHR0nucnlUO0jRUyn0'; // Make sure this is correct

// Initialize Supabase client
let supabase;
try {
    console.log("Creating Supabase client...");
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase client created successfully");
} catch (error) {
    console.error("Error creating Supabase client:", error);
}

// Add this at the top of the file after initializing Supabase
console.log("Supabase client initialized");

// Initialize database connection
async function initDB() {
    try {
        // Test connection to Supabase
        const { data, error } = await supabase.from('users').select('id').limit(1);
        
        if (error) {
            throw new Error('Supabase connection failed: ' + error.message);
        }
        
        console.log('Supabase connection established successfully');
        return true;
    } catch (error) {
        console.error('Database initialization failed:', error);
        return false;
    }
}

// Save profile data
async function saveProfile(userId, profileData) {
    console.log("saveProfile called with userId:", userId);
    console.log("profileData:", profileData);
    
    try {
        // Check if Supabase client is initialized
        if (!supabase) {
            console.error("Supabase client is not initialized");
            return false;
        }
        
        console.log("Saving basic user info to Supabase...");
        
        // Save basic info
        const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert({
                id: userId,
                full_name: profileData.basicInfo.fullName,
                email: profileData.basicInfo.email,
                department: profileData.basicInfo.department,
                year: profileData.basicInfo.year,
                profile_picture: profileData.basicInfo.profilePicture,
                updated_at: new Date().toISOString()
            });
            
        if (userError) {
            console.error("Error saving user data:", userError);
            throw userError;
        }
        
        console.log("User data saved successfully:", userData);
        
        // Process interests
        const technical = Array.isArray(profileData.interests.technical) ? 
            profileData.interests.technical : [];
            
        const nonTechnical = Array.isArray(profileData.interests.nonTechnical) ? 
            profileData.interests.nonTechnical : [];
            
        console.log("Processing interests:", { technical, nonTechnical });
        
        // Delete existing interests
        console.log("Deleting existing interests...");
        const { error: deleteInterestsError } = await supabase
            .from('interests')
            .delete()
            .eq('user_id', userId);
            
        if (deleteInterestsError) {
            console.error("Error deleting interests:", deleteInterestsError);
            throw deleteInterestsError;
        }
        
        // Prepare interests data
        const interestsToInsert = [];
        
        technical.forEach(interest => {
            interestsToInsert.push({
                user_id: userId,
                category: 'technical',
                interest: interest
            });
        });
        
        nonTechnical.forEach(interest => {
            interestsToInsert.push({
                user_id: userId,
                category: 'non-technical',
                interest: interest
            });
        });
        
        // Insert new interests if there are any
        if (interestsToInsert.length > 0) {
            console.log("Inserting new interests:", interestsToInsert);
            const { error: insertInterestsError } = await supabase
                .from('interests')
                .insert(interestsToInsert);
                
            if (insertInterestsError) {
                console.error("Error inserting interests:", insertInterestsError);
                throw insertInterestsError;
            }
        }
        
        // Process preferences
        console.log("Processing preferences...");
        
        // Get content preferences
        const contentPrefs = Array.isArray(profileData.preferences.contentPreferences) ? 
            profileData.preferences.contentPreferences : [];
            
        // Get notification preferences
        const emailNotifications = profileData.preferences.notifications?.email || false;
        const eventReminders = profileData.preferences.notifications?.events || false;
        
        // Delete existing preferences
        console.log("Deleting existing preferences...");
        const { error: deletePrefsError } = await supabase
            .from('preferences')
            .delete()
            .eq('user_id', userId);
            
        if (deletePrefsError) {
            console.error("Error deleting preferences:", deletePrefsError);
            throw deletePrefsError;
        }
        
        // Prepare preferences data
        const prefsToInsert = [];
        
        // Add content preferences
        contentPrefs.forEach(pref => {
            prefsToInsert.push({
                user_id: userId,
                type: 'content',
                value: pref
            });
        });
        
        // Add notification preferences
        prefsToInsert.push({
            user_id: userId,
            type: 'emailNotifications',
            value: emailNotifications ? 'true' : 'false'
        });
        
        prefsToInsert.push({
            user_id: userId,
            type: 'eventReminders',
            value: eventReminders ? 'true' : 'false'
        });
        
        // Insert new preferences
        if (prefsToInsert.length > 0) {
            console.log("Inserting new preferences:", prefsToInsert);
            const { error: insertPrefsError } = await supabase
                .from('preferences')
                .insert(prefsToInsert);
                
            if (insertPrefsError) {
                console.error("Error inserting preferences:", insertPrefsError);
                throw insertPrefsError;
            }
        }
        
        console.log("All data saved successfully to Supabase");
        return true;
    } catch (error) {
        console.error('Error saving profile to Supabase:', error);
        return false;
    }
}

// Load profile data from Supabase
async function loadProfile(userId) {
    try {
        // Load user data
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (userError) throw userError;
        if (!userData) return null;

        // Load interests
        const { data: interestsData, error: interestsError } = await supabase
            .from('interests')
            .select('category, interest')
            .eq('user_id', userId);
            
        if (interestsError) throw interestsError;

        // Load preferences
        const { data: preferencesData, error: preferencesError } = await supabase
            .from('preferences')
            .select('type, value')
            .eq('user_id', userId);
            
        if (preferencesError) throw preferencesError;

        // Process interests
        const technical = [];
        const nonTechnical = [];
        
        interestsData.forEach(item => {
            if (item.category === 'technical') {
                technical.push(item.interest);
            } else {
                nonTechnical.push(item.interest);
            }
        });

        // Process preferences
        const contentPreferences = [];
        let emailNotifications = false;
        let eventReminders = false;
        
        preferencesData.forEach(item => {
            if (item.type === 'content') {
                contentPreferences.push(item.value);
            } else if (item.type === 'emailNotifications') {
                emailNotifications = item.value === 'true';
            } else if (item.type === 'eventReminders') {
                eventReminders = item.value === 'true';
            }
        });

        // Combine all data into a profile object
        const profileData = {
            basicInfo: {
                fullName: userData.full_name,
                email: userData.email,
                department: userData.department,
                year: userData.year,
                profilePicture: userData.profile_picture
            },
            interests: {
                technical,
                nonTechnical
            },
            preferences: {
                contentPreferences,
                notifications: {
                    email: emailNotifications,
                    events: eventReminders
                }
            },
            lastUpdated: userData.updated_at
        };

        // Save to sessionStorage for immediate use
        sessionStorage.setItem('profileData', JSON.stringify(profileData));
        
        return profileData;
    } catch (error) {
        console.error('Error loading profile from Supabase:', error);
        return null;
    }
}

// Export functions
window.dbService = {
    initDB,
    saveProfile,
    loadProfile
}; 