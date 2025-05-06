const express = require('express');
const { sendMessage, getChatHistory, getConversations } = require('../controllers/chatController');

const router = express.Router();

// Route to send a message
router.post('/messages', sendMessage);

// Route to get chat history between two users
router.get('/messages/:userId1/:userId2', getChatHistory);

// Route to get chat history for a specific user
router.get('/conversations/:userId', getConversations);

module.exports = router;