const Message = require('../models/messageModel');
const mongoose = require('mongoose'); // Import mongoose to use for database operations

const sendMessage = async (req, res) => {
    const { receiverId, message } = req.body;

    console.log("bodyul: ", req.body); // Log the request body to see the data being sent
    console.log("headerul: ", req.user); // Log the request headers to see the JWT token

    // Use the userID from the JWT as the senderId
    const senderId = String(req.user.id);
    
    console.log("types of data user",typeof senderId, typeof receiverId); // Log the types of userId1 and userId2
    console.log("values of data user",senderId, receiverId); // Log the values of userId1 and userId2

    try {
    
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const getChatHistory = async (req, res) => {
    const userId1 = String(req.user.id) // Extract the authenticated user's ID from the JWT
    const { userId2 } = req.params; // The other user's ID is passed as a route parameter

    console.log("types of data user",typeof userId1, typeof userId2); // Log the types of userId1 and userId2
    console.log("values of data user",userId1, userId2); // Log the values of userId1 and userId2

    try {

        const dbName = mongoose.connection.db?.databaseName || 'Unknown';
        console.log(`Fetching chat history from database: ${dbName}`);

        // Fetch messages where the authenticated user is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ],
        }).sort({ timestamp: 1 }); // Sort messages by timestamp

        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chat history' });
    }
};

const getConversations = async (req, res) => {
    const userId = String(req.user.id); // Extract the authenticated user's ID from the JWT

    console.log("types of data user",typeof userId); // Log the types of userId
    console.log("values of data user",userId); // Log the values of userId

    try {

        const dbName = mongoose.connection.db?.databaseName || 'Unknown';
        console.log(`Fetching chat history from database: ${dbName}`);

        // Aggregate conversations where the authenticated user is either the sender or receiver
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId },
                    ],
                },
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lt: ["$senderId", "$receiverId"] },
                            { $concat: ["$senderId", "_", "$receiverId"] },
                            { $concat: ["$receiverId", "_", "$senderId"] },
                        ],
                    },
                    participants: { $addToSet: "$senderId" },
                    lastMessage: { $last: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$receiverId", userId] }, { $eq: ["$read", false] }] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        res.status(200).json({ conversations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve conversations' });
    }
};

module.exports = { sendMessage, getChatHistory, getConversations };