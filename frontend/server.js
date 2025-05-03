const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001; // Port for the frontend server

app.use(cors());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Frontend is running at http://localhost:${PORT}`);
});