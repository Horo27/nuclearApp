const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

// Route for user login
router.post('/login', loginController.login);

// Route for user registration
router.post('/register', loginController.register);

// Route for jwt token verification
router.get('/getUser', loginController.getUser);

module.exports = router;