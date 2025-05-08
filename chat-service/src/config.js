require('dotenv').config();

console.log("in the config",process.env.MONGO_URI); // Log the MongoDB URI to check if it's being read correctly

module.exports = {
    PORT: process.env.PORT || 3002,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
};