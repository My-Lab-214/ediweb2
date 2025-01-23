const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Middleware
app.use(cors());
app.use(bodyParser.json());

// GitHub repo details
const GITHUB_API_URL = 'https://api.github.com/repos/My-Lab-214/ediweb2/contents/index.html';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // Store token in .env file

// Fetch latest content from GitHub
app.get('/content', async (req, res) => {
    try {
        const response = await axios.get(GITHUB_API_URL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        res.json({ content });
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Update content in GitHub
app.post('/update', async (req, res) => {
    const { newText } = req.body;

    try {
        // Get current file SHA
        const fileResponse = await axios.get(GITHUB_API_URL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        const fileSHA = fileResponse.data.sha;

        // Encode new content to Base64
        const encodedContent = Buffer.from(newText).toString('base64');

        // Send update request
        await axios.put(GITHUB_API_URL, {
            message: 'Updated text content via Node.js',
            content: encodedContent,
            sha: fileSHA
        }, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });

        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self' 'unsafe-inline';"
    );
    next();
});
app.get('/favicon.ico', (req, res) => res.status(204).end());
