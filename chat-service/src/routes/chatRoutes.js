const express = require('express');
const { sendMessage, getChatHistory, getConversations } = require('../controllers/chatController');
const authorize = require('../../../login-service/src/utils/authorize')

const router = express.Router();

// Route to send a message
router.post('/messages', authorize(['user','admin']), sendMessage);

// Route to get chat history between two users
router.get('/messages/:userId1/:userId2', authorize(['user','admin']), getChatHistory);

// Route to get chat history for a specific user
router.get('/conversations/:userId', authorize(['user','admin']), getConversations);

module.exports = router;