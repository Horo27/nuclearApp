
// Current user data (TODO: Replace with actual user data from backend)
const currentUser = {
    id: 'user-1',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'online'
};

// Sample conversations data (TODO: Replace with API call to backend)
const conversations = [
    {
        id: 'conv-1',
        type: 'group',
        name: 'Coffee Lovers',
        participants: [
            {
                id: 'user-2',
                name: 'Jane Cooper',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                status: 'online'
            },
            {
                id: 'user-3',
                name: 'Michael Smith',
                avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                status: 'offline'
            }
        ],
        lastMessage: {
            sender: 'user-2',
            text: 'The new blend is amazing!',
            timestamp: '2023-06-15T12:45:00Z',
            read: false
        },
        unreadCount: 3,
        isTyping: ['user-2']
    },
    {
        id: 'conv-2',
        type: 'group',
        name: 'Barista Team',
        participants: [
            {
                id: 'user-4',
                name: 'Alex Johnson',
                avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                status: 'online'
            },
            {
                id: 'user-5',
                name: 'Sarah Williams',
                avatar: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                status: 'online'
            }
        ],
        lastMessage: {
            sender: 'user-4',
            text: 'Don\'t forget the staff meeting',
            timestamp: '2023-06-15T10:30:00Z',
            read: true
        },
        unreadCount: 0,
        isTyping: []
    },
    {
        id: 'conv-3',
        type: 'direct',
        name: 'Jane Cooper',
        participants: [
            {
                id: 'user-2',
                name: 'Jane Cooper',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                status: 'online'
            }
        ],
        lastMessage: {
            sender: 'user-2',
            text: 'Thanks for the coffee this morning!',
            timestamp: '2023-06-15T09:15:00Z',
            read: false
        },
        unreadCount: 1,
        isTyping: []
    }
];

// Sample messages data (TODO: Replace with API call to backend when a conversation is selected)
const messages = {
    'conv-1': [
        {
            id: 'msg-1',
            sender: 'user-2',
            text: 'Hey everyone! Just tried the new seasonal blend and it\'s amazing!',
            timestamp: '2023-06-15T12:45:00Z',
            type: 'text'
        },
        {
            id: 'msg-2',
            sender: currentUser.id,
            text: 'I know right? It\'s my favorite so far this year!',
            timestamp: '2023-06-15T12:47:00Z',
            type: 'text',
            status: 'delivered'
        },
        {
            id: 'msg-3',
            sender: 'user-3',
            text: 'Check out this latte art I made with the new blend!',
            timestamp: '2023-06-15T12:49:00Z',
            type: 'image',
            imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 'msg-4',
            sender: currentUser.id,
            text: 'Wow that\'s incredible! You\'ve really improved!',
            timestamp: '2023-06-15T12:51:00Z',
            type: 'text',
            status: 'delivered'
        },
        {
            id: 'msg-5',
            sender: 'user-2',
            text: 'We should feature this on our Instagram. Customers will love it!',
            timestamp: '2023-06-15T12:52:00Z',
            type: 'text'
        }
    ],
    'conv-2': [
        // Messages for Barista Team conversation
    ],
    'conv-3': [
        // Messages for direct conversation with Jane
    ]
};

// DOM elements
const conversationsList = document.getElementById('conversations-list');
const messagesContainer = document.getElementById('messages-container');
const emptyState = document.getElementById('empty-state');
const messageInputContainer = document.getElementById('message-input-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatHeader = document.getElementById('chat-header');
const chatHeaderAvatars = document.getElementById('chat-header-avatars');
const chatTitle = document.getElementById('chat-title');
const chatSubtitle = document.getElementById('chat-subtitle');
const chatActions = document.getElementById('chat-actions');
const searchInput = document.getElementById('search-conversations');

// Current active conversation
let activeConversationId = null;

// Format date/time
function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // If this week, show day name
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    }

    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// Render conversation list item
function renderConversationItem(conversation) {
    const isActive = activeConversationId === conversation.id;
    const lastMessageTime = formatDateTime(conversation.lastMessage.timestamp);

    // Determine avatar(s) to show
    let avatarsHtml = '';
    if (conversation.type === 'direct') {
        const participant = conversation.participants[0];
        avatarsHtml = `
                    <div class="relative">
                        <img src="${participant.avatar}" alt="${participant.name}" class="h-10 w-10 rounded-full object-cover border-2 border-white">
                        <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full ${participant.status === 'online' ? 'bg-green-500' : 'bg-gray-300'} ring-2 ring-white"></span>
                    </div>
                `;
    } else {
        // For groups, show first 2-3 participants
        const participantsToShow = conversation.participants.slice(0, 3);
        avatarsHtml = `
                    <div class="relative">
                        <div class="flex -space-x-2">
                            ${participantsToShow.map(p =>
            `<img src="${p.avatar}" alt="${p.name}" class="h-10 w-10 rounded-full object-cover border-2 border-white">`
        ).join('')}
                        </div>
                        ${conversation.participants.length > 3 ?
                `<span class="absolute -bottom-1 -right-1 bg-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-gray-200">+${conversation.participants.length - 3}</span>` : ''}
                    </div>
                `;
    }

    return `
                <div class="chat-item px-4 py-3 flex items-center cursor-pointer ${isActive ? 'active-chat' : ''}" 
                     data-conversation-id="${conversation.id}" onclick="loadConversation('${conversation.id}')">
                    ${avatarsHtml}
                    <div class="ml-3 flex-1">
                        <div class="flex items-center justify-between">
                            <h4 class="text-sm font-medium text-gray-900">${conversation.name}</h4>
                            <span class="text-xs text-gray-500">${lastMessageTime}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <p class="text-sm text-gray-500 truncate">
                                ${conversation.lastMessage.sender === currentUser.id ? 'You: ' : conversation.type === 'direct' ? '' : `${conversation.participants.find(p => p.id === conversation.lastMessage.sender)?.name || 'Someone'}: `}
                                ${conversation.lastMessage.text}
                            </p>
                            ${conversation.unreadCount > 0 ?
            `<span class="unread-badge h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold">${conversation.unreadCount}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
}

// Render message
function renderMessage(message, conversation) {
    const isCurrentUser = message.sender === currentUser.id;
    const sender = isCurrentUser ? currentUser :
        conversation.type === 'direct' ? conversation.participants[0] :
            conversation.participants.find(p => p.id === message.sender) || { name: 'Unknown', avatar: '' };

    const messageTime = formatDateTime(message.timestamp);

    if (isCurrentUser) {
        return `
                    <div class="flex justify-end mb-4">
                        <div class="text-right">
                            <div class="message-bubble sent-message px-4 py-2 mb-1">
                                ${message.type === 'image' ?
                `<img src="${message.imageUrl}" alt="Shared image" class="w-full max-w-xs rounded-lg mb-2">` : ''}
                                <p>${message.text}</p>
                            </div>
                            <span class="text-xs text-gray-500">${messageTime} • ${message.status || 'Sent'}</span>
                        </div>
                        <img src="${currentUser.avatar}" alt="${currentUser.name}" class="h-8 w-8 rounded-full object-cover ml-2 mt-1">
                    </div>
                `;
    } else {
        return `
                    <div class="flex mb-4">
                        <img src="${sender.avatar}" alt="${sender.name}" class="h-8 w-8 rounded-full object-cover mr-2 mt-1">
                        <div>
                            <div class="message-bubble received-message px-4 py-2 mb-1">
                                ${message.type === 'image' ?
                `<img src="${message.imageUrl}" alt="Shared image" class="w-full max-w-xs rounded-lg mb-2">` : ''}
                                <p>${message.text}</p>
                            </div>
                            <span class="text-xs text-gray-500">${sender.name} • ${messageTime}</span>
                        </div>
                    </div>
                `;
    }
}

async function loadConversations() {
    try {
        const response = await fetch(`http://localhost:3002/api/chat/conversations`,{
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        conversations = data.conversations.map(conv => ({
            id: conv._id, // Use the conversation ID from the backend
            type: conv.participants.length > 2 ? 'group' : 'direct',
            name: conv.participants.length > 2 ? 'Group Chat' : conv.participants.find(p => p !== currentUser.id),
            participants: conv.participants,
            lastMessage: {
                sender: conv.lastMessage.senderId,
                text: conv.lastMessage.message,
                timestamp: conv.lastMessage.timestamp//,
                //read: conv.lastMessage.read
            },
            unreadCount: conv.unreadCount,
            isTyping: [] // Placeholder for typing indicator
        }));

        renderConversations();
    } catch (err) {
        console.error('Error loading conversations:', err);
    }
}

// Render all conversations
function renderConversations() {
    // Group conversations by type
    const groupConversations = conversations.filter(c => c.type === 'group');
    const directConversations = conversations.filter(c => c.type === 'direct');

    let html = '';

    if (groupConversations.length > 0) {
        html += `
                    <div class="px-4 py-2">
                        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Group Chats</h3>
                    </div>
                    ${groupConversations.map(renderConversationItem).join('')}
                `;
    }

    if (directConversations.length > 0) {
        html += `
                    <div class="px-4 py-2">
                        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Direct Messages</h3>
                    </div>
                    ${directConversations.map(renderConversationItem).join('')}
                `;
    }

    conversationsList.innerHTML = html;
}

// Load a specific conversation
async function loadConversation(conversationId) {
    // Set active conversation
    activeConversationId = conversationId;

    // Update UI
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.toggle('active-chat', item.dataset.conversationId === conversationId);
    });

    // Find the conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Extract the reciever ID
    const receiver = conversation.participants.find(p => p.id !== currentUser.id);
    if (!receiver) {
        console.error('Receiver not found in conversation participants');
        return;
    }

    // Update chat header
    updateChatHeader(conversation);

    // Show message input
    messageInputContainer.style.display = 'block';
    emptyState.style.display = 'none';

    try {
        const response = await fetch(`http://localhost:3002/api/chat/messages/${receiver.id}`,{
            credentials: 'include' // Include cookies in the request
        });
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        renderMessages(data.messages, conversation);
    } catch (err) {
        console.error('Error loading conversation messages:', err);
    }
}

// Update chat header with conversation info
function updateChatHeader(conversation) {
    // Avatars
    let avatarsHtml = '';
    if (conversation.type === 'direct') {
        const participant = conversation.participants[0];
        avatarsHtml = `
                    <div class="relative">
                        <img src="${participant.avatar}" alt="${participant.name}" class="h-10 w-10 rounded-full object-cover border-2 border-white">
                        <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full ${participant.status === 'online' ? 'bg-green-500' : 'bg-gray-300'} ring-2 ring-white"></span>
                    </div>
                `;
    } else {
        // For groups, show first 2 participants
        const participantsToShow = conversation.participants.slice(0, 2);
        avatarsHtml = `
                    <div class="relative">
                        <div class="flex -space-x-2">
                            ${participantsToShow.map(p =>
            `<img src="${p.avatar}" alt="${p.name}" class="h-10 w-10 rounded-full object-cover border-2 border-white">`
        ).join('')}
                        </div>
                    </div>
                `;
    }
    chatHeaderAvatars.innerHTML = avatarsHtml;

    // Title and subtitle
    chatTitle.textContent = conversation.name;

    let subtitleHtml = '';
    if (conversation.type === 'direct') {
        const participant = conversation.participants[0];
        subtitleHtml = `
                    <p class="text-sm text-gray-500">${participant.status === 'online' ? 'Online' : 'Offline'}</p>
                `;
    } else {
        const participantNames = conversation.participants.map(p => p.name).join(', ');
        subtitleHtml = `
                    <p class="text-sm text-gray-500">${participantNames}</p>
                `;
    }

    // Add typing indicator if someone is typing
    if (conversation.isTyping && conversation.isTyping.length > 0) {
        const typingUsers = conversation.isTyping.map(id => {
            const user = conversation.participants.find(p => p.id === id);
            return user ? user.name : 'Someone';
        }).join(', ');

        subtitleHtml += `
                    <span class="mx-2 text-gray-400">•</span>
                    <div class="typing-indicator flex items-center">
                        <span class="text-xs text-indigo-600 font-medium">${typingUsers} ${typingUsers.includes(',') ? 'are' : 'is'} typing</span>
                        <span class="ml-1 flex space-x-1">
                            <span class="h-1 w-1 bg-indigo-600 rounded-full inline-block"></span>
                            <span class="h-1 w-1 bg-indigo-600 rounded-full inline-block"></span>
                            <span class="h-1 w-1 bg-indigo-600 rounded-full inline-block"></span>
                        </span>
                    </div>
                `;
    }

    chatSubtitle.innerHTML = subtitleHtml;

    // Actions
    chatActions.innerHTML = `
                <button class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="fas fa-video"></i>
                </button>
                <button class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="fas fa-ellipsis-vertical"></i>
                </button>
            `;
}

// Render messages for a conversation
function renderMessages(messages, conversation) {
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
                    <div class="h-full flex flex-col items-center justify-center text-center px-4">
                        <div class="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-comment-alt text-indigo-500 text-3xl"></i>
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                        <p class="text-gray-500 max-w-md">Send a message to start the conversation with ${conversation.type === 'direct' ? conversation.participants[0].name : conversation.name}.</p>
                    </div>
                `;
        return;
    }

    // Group messages by date
    const messagesByDate = {};
    messages.forEach(message => {
        const date = new Date(message.timestamp).toDateString();
        if (!messagesByDate[date]) {
            messagesByDate[date] = [];
        }
        messagesByDate[date].push(message);
    });

    let html = '';

    // Add each date group
    Object.entries(messagesByDate).forEach(([date, dateMessages]) => {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let dateLabel;
        if (date === today) {
            dateLabel = 'TODAY';
        } else if (date === yesterday.toDateString()) {
            dateLabel = 'YESTERDAY';
        } else {
            dateLabel = new Date(date).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
        }

        html += `
                    <div class="flex items-center my-4">
                        <div class="flex-1 border-t border-gray-200"></div>
                        <span class="mx-4 text-xs text-gray-500 font-medium">${dateLabel}</span>
                        <div class="flex-1 border-t border-gray-200"></div>
                    </div>
                    ${dateMessages.map(msg => renderMessage(msg, conversation)).join('')}
                `;
    });

    messagesContainer.innerHTML = html;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a new message
async function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText || !activeConversationId) return;

    // Create new message object
    const newMessage = {
        sender: currentUser.id,
        text: messageText,
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'sending'
    };

    // Add to UI immediately for better UX
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (conversation) {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML += renderMessage(newMessage, conversation);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Clear input
    messageInput.value = '';

    try {
        const response = await fetch('http://localhost:3002/api/chat/messages', {
            method: 'POST',
            credentials: 'include', // Include cookies in the request
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receiverId: activeConversationId, // Backend expects receiverId
                message: messageText,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();

        // Update message status to delivered
        setTimeout(() => {
            newMessage.status = 'delivered';
            const messageElements = document.querySelectorAll('.message-bubble');
            if (messageElements.length > 0) {
                const lastMessage = messageElements[messageElements.length - 1];
                const statusElement = lastMessage.parentElement.querySelector('.text-xs');
                if (statusElement) {
                    statusElement.textContent = `${formatDateTime(newMessage.timestamp)} • Delivered`;
                }
            }
        }, 1000);

        renderConversations();
    } catch (err) {
        console.error('Error sending message:', err);
    }

    // // Update last message in conversation
    // if (conversation) {
    //     conversation.lastMessage = {
    //         sender: currentUser.id,
    //         text: messageText,
    //         timestamp: newMessage.timestamp,
    //         read: false
    //     };
}

async function fetchCurrentUser() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/getUser', {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current user');
        }

        const data = await response.json();
        return data.user; // Return the user data
    } catch (err) {
        console.error('Error fetching current user:', err);
        return null;
    }
}

// Initialize the app
async function init() {

    // Fetch the current user
    const user = await fetchCurrentUser();
    if (!user) {
        console.error('User not authenticated. Redirecting to login...');
        window.location.href = '/'; // Redirect to login page if not authenticated
        return;
    }

    // Set the current user
    currentUser.id = user.id;
    currentUser.name = user.name;
    currentUser.avatar = user.avatar || currentUser.avatar; // Use default avatar if not provided

    loadConversations();

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // TODO: Replace with API call to search conversations
        // fetch(`/api/conversations?search=${searchTerm}`)
        //   .then(response => response.json())
        //   .then(data => {
        //       conversations = data;
        //       renderConversations();
        //   });

        // For demo purposes, filter the existing conversations
        const filtered = conversations.filter(conv =>
            conv.name.toLowerCase().includes(searchTerm) ||
            conv.participants.some(p => p.name.toLowerCase().includes(searchTerm)) ||
            conv.lastMessage.text.toLowerCase().includes(searchTerm)
        );

        // Re-render with filtered results
        if (searchTerm) {
            const html = filtered.map(renderConversationItem).join('');
            conversationsList.innerHTML = html || '<p class="px-4 py-3 text-gray-500">No conversations found</p>';
        } else {
            renderConversations();
        }
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', async () => {
    await init();
});
 