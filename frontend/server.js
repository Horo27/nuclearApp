const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001; // Port for the frontend server

app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from the login service
    credentials: true // Allow cookies to be sent with requests
}));
app.use(cookieParser())

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve the chat HTML file
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat.html'));
})

// Start the server
app.listen(PORT, () => {
    console.log(`Frontend is running at http://localhost:${PORT}`);
});