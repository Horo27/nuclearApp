const mongoose = require('mongoose');
const config = require('../config');

console.log(config.MONGO_URI); // Log the MongoDB URI to check if it's being read correctly
console.log("salut")

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            
        });
        console.log('Connected to MongoDB:', mongoose.connection.db.databaseName);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = { connectToDatabase };