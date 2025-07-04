const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
const PORT = 8000;

// Your Google OAuth client ID
const CLIENT_ID = '1048859318092-ikf792r4l9mb4ctobr6m5h6velfevote.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Handle Google OAuth callback
app.post('/auth/google/callback', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: CLIENT_ID
        });

        const payload = ticket.getPayload();
        const email = payload.email;

        // Check if email is from allowed domain
        if (!email.endsWith('@klu.ac.in')) {
            return res.status(401).json({ error: 'Please use your college email address' });
        }

        // If everything is valid, send success response
        res.json({
            success: true,
            user: {
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            }
        });

    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 