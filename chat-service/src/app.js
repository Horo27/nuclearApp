const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const chatRoutes = require('./routes/chatRoutes'); // For scaling the chat-service
const chatRoutes = require('./routes/chatRoutesJWT'); // Using the auth middleware with JWT
const { connectToDatabase } = require('./utils/db');
const config = require('./config');
const cors = require('cors'); // Importing CORS for cross-origin requests

const app = express();

//Cord config
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from the frontend server
    credentials: true // Allow cookies to be sent with requests
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/chat', chatRoutes);

// Start the server
const PORT = config.PORT || 3002;
app.listen(PORT, async () => {
    await connectToDatabase();
    console.log(`Chat-Service is running on port ${PORT}`);
});