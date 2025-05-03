const express = require('express');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

// Route to send a message
router.post('/messages', sendMessage);

// Route to get chat history between two users
router.get('/messages/:userId1/:userId2', getChatHistory);

module.exports = router;