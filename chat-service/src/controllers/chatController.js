const Message = require('../models/messageModel');

// Send a message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    try {
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// Get chat history between two users
const getChatHistory = async (req, res) => {
    const { userId1, userId2 } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ],
        }).sort({ timestamp: 1 });

        res.status(200).json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve chat history' });
    }
};

// Get conversations for a specific user
const getConversations = async (req, res) => {
    const { userId } = req.params;

    try {
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $lt: ["$senderId", "$receiverId"] },
                            { $concat: ["$senderId", "_", "$receiverId"] },
                            { $concat: ["$receiverId", "_", "$senderId"] }
                        ]
                    },
                    participants: { $addToSet: "$senderId" },
                    lastMessage: { $last: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$receiverId", userId] }, { $eq: ["$read", false] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({ conversations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve conversations' });
    }
}

module.exports = { sendMessage, getChatHistory, getConversations };