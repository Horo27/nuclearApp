const express = require('express');
const { sendMessage, getChatHistory, getConversations } = require('../controllers/chatControllerJWT');
const authorize = require('../utils/authorize') //authorize is mapped by docker to the authorize inside the login-service

const router = express.Router();

// Route to send a message
router.post('/messages', authorize(['user','admin']), sendMessage);

// Route to get chat history between two users
router.get('/messages/:userId2', authorize(['user','admin']), getChatHistory);

// Route to get chat history for a specific user
router.get('/conversations', authorize(['user','admin']), getConversations);

module.exports = router;