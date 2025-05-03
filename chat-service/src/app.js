const express = require('express');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');
const { connectToDatabase } = require('./utils/db');
const config = require('./config');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);

// Start the server
const PORT = config.PORT || 3002;
app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Chat-Service is running on port ${PORT}`);
});