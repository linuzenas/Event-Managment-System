// Chatbot functionality
let isChatOpen = false;
let currentPage = '';

// Determine current page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('clubs.html')) return 'clubs';
    if (path.includes('events.html')) return 'events';
    if (path.includes('career-guidance.html')) return 'career';
    if (path.includes('dashboard.html')) return 'dashboard';
    return 'other';
}

function getPageSpecificInitialMessage() {
    currentPage = getCurrentPage();
    switch(currentPage) {
        case 'clubs':
            return "Hi! 👋 I can help you with:\n• Finding clubs\n• Joining clubs\n• Club activities\n• Club schedules";
        case 'events':
            return "Hi! 👋 I can help you with:\n• Upcoming events\n• Event registration\n• Event schedules\n• Workshop details";
        case 'career':
            return "Hi! 👋 I can help you with:\n• Career roadmaps\n• Job opportunities\n• Career counseling\n• Industry connections";
        default:
            return "Hi! 👋 I can help you with:\n• Finding events\n• Joining clubs\n• Career guidance\n• Scheduling appointments";
    }
}

function toggleChat() {
    const chatContainer = document.querySelector('.chatbot-container');
    const chatButton = document.querySelector('.chatbot-button');
    isChatOpen = !isChatOpen;
    
    if (isChatOpen) {
        chatContainer.style.display = 'flex';
        chatButton.style.display = 'none';
        if (!document.querySelector('.bot-message')) {
            addBotMessage("Hi! I'm KARE Assistant.");
            addBotMessage(getPageSpecificInitialMessage());
        }
    } else {
        chatContainer.style.display = 'none';
        chatButton.style.display = 'flex';
    }
}

function addMessage(message, isBot = false) {
    try {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.error('Chat messages container not found');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error adding message:', error);
    }
}

function addBotMessage(message) {
    addMessage(message, true);
}

function addUserMessage(message) {
    addMessage(message, false);
}

function getPageSpecificResponse(message) {
    message = message.toLowerCase();
    currentPage = getCurrentPage();

    // Club page specific responses
    if (currentPage === 'clubs') {
        if (message.includes('join')) {
            return "To join a club, click the 'Join Club' button on any club card. You'll need to:\n• Fill out a brief form\n• Select your interests\n• Submit your request\n\nWould you like to see the available clubs?";
        }
        if (message.includes('technical') || message.includes('tech club')) {
            return "Our technical clubs include:\n• Coding Club\n• Robotics Club\n• AI/ML Club\n• Cybersecurity Club\n\nWhich one interests you?";
        }
        if (message.includes('cultural') || message.includes('art')) {
            return "Our cultural clubs include:\n• Dance Club\n• Music Club\n• Drama Club\n• Art Club\n\nWould you like to know more about any of these?";
        }
        if (message.includes('activities') || message.includes('events')) {
            return "Each club organizes various activities like:\n• Weekly meetings\n• Workshops\n• Competitions\n• Project showcases\n\nCheck the club's page for their upcoming events!";
        }
    }

    // Events page specific responses
    if (currentPage === 'events') {
        if (message.includes('register') || message.includes('sign up')) {
            return "To register for an event:\n• Click on the event card\n• Fill in your details\n• Submit registration\n\nNeed help with a specific event?";
        }
        if (message.includes('workshop')) {
            return "Our upcoming workshops include:\n• Technical skills\n• Soft skills\n• Industry expert sessions\n\nWhich type interests you?";
        }
        if (message.includes('schedule') || message.includes('timing')) {
            return "You can find event schedules:\n• On the event cards\n• In your dashboard calendar\n• Through email notifications\n\nWould you like me to show you how to set reminders?";
        }
    }

    // Career guidance page specific responses
    if (currentPage === 'career') {
        if (message.includes('what') || message.includes('do you do')) {
            return "I can help you with:\n• Career roadmaps and planning\n• Job opportunities\n• Internship guidance\n• Scheduling counseling sessions\n\nWhat would you like to know more about?";
        }
        if (message.includes('roadmap') || message.includes('path')) {
            return "We have detailed career roadmaps for:\n• Software Development\n• Data Science\n• Backend Development\n• Web Development\n\nWhich field would you like to explore?";
        }
        if (message.includes('software') || message.includes('web')) {
            return "For Software/Web Development, here's the typical path:\n• Learn HTML, CSS, JavaScript basics\n• Master Modern JavaScript (ES6+)\n• Learn React/Next.js\n• Study Backend technologies\n• Practice with real projects\n\nWould you like more details about any of these steps?";
        }
        if (message.includes('data') || message.includes('science')) {
            return "For Data Science, here's the recommended path:\n• Statistics & Mathematics\n• Python for Data Analysis\n• Data Visualization\n• Machine Learning Basics\n• Big Data Tools\n\nWould you like to know more about these areas?";
        }
        if (message.includes('counseling') || message.includes('guidance') || message.includes('session')) {
            return "I can help you schedule a counseling session. Our counselors provide:\n• One-on-one career guidance\n• Resume building tips\n• Interview preparation\n• Industry insights\n\nWould you like to schedule a session?";
        }
        if (message.includes('schedule') || message.includes('book') || message.includes('appointment')) {
            return "To schedule a counseling session:\n• Click the 'Schedule Session' button\n• Choose your preferred time slot\n• Select a counselor\n• Confirm your booking\n\nWould you like me to help you with scheduling?";
        }
        if (message.includes('internship') || message.includes('job') || message.includes('placement')) {
            return "We regularly update opportunities for:\n• Summer internships\n• Full-time positions\n• Campus placements\n• Industry projects\n\nCheck the 'Opportunities' section for the latest openings!";
        }
    }

    // If no specific career response matches, use the general response handler
    return getBotResponse(message);
}

function getBotResponse(message) {
    message = message.toLowerCase();
    
    // General responses for all pages
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
        return getPageSpecificInitialMessage();
    }
    
    if (message.includes('help') || message.includes('what') || message.includes('how')) {
        return "I can help you navigate KARE SPHERE! What specifically would you like to know about:\n• Events and activities\n• Club memberships\n• Career opportunities\n• Scheduling appointments";
    }

    // Default response
    return "I can help you with information about events, clubs, career guidance, and more. Could you please be more specific about what you're looking for?";
}

function handleUserInput() {
    const input = document.getElementById('userInput');
    if (!input) return;

    const message = input.value.trim();
    if (message) {
        // Add user message
        addUserMessage(message);
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        addBotMessage("typing...");
        
        // Get response after delay
        setTimeout(() => {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.bot-message:last-child');
            if (typingIndicator && typingIndicator.textContent === "typing...") {
                typingIndicator.remove();
            }
            
            // Add bot response
            const response = getPageSpecificResponse(message);
            addBotMessage(response);
        }, 1000);
    }
}

// Initialize chatbot only on pages other than index.html
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('index.html') && !document.querySelector('.chatbot-widget')) {
        const chatbotHTML = `
            <div class="chatbot-widget">
                <div class="chatbot-button">
                    <div class="chatbot-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chatbot-label">
                        KARE Assistant
                    </div>
                </div>
                
                <div class="chatbot-container" style="display: none;">
                    <div class="chat-header">
                        <div class="chat-title">
                            <i class="fas fa-robot"></i>
                            KARE Assistant
                        </div>
                        <button class="close-chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages"></div>
                    
                    <div class="chat-input">
                        <input type="text" id="userInput" placeholder="Type your message...">
                        <button id="sendButton">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add chatbot HTML to page
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        
        // Set up event listeners after adding HTML
        const chatbotButton = document.querySelector('.chatbot-button');
        const closeButton = document.querySelector('.close-chat');
        const sendButton = document.getElementById('sendButton');
        const userInput = document.getElementById('userInput');
        
        // Chat toggle listeners
        chatbotButton.addEventListener('click', toggleChat);
        closeButton.addEventListener('click', toggleChat);
        
        // Input listeners
        sendButton.addEventListener('click', handleUserInput);
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleUserInput();
            }
        });
    }
}); 