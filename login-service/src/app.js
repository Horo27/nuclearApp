const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/loginRoutes');
const config = require('./config');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

//app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', loginRoutes);

// Start the server
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
module.exports = config;