const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3001', // Frontend origin
    credentials: true, // Allow cookies
}));

// Proxy requests to login-service
app.use('/gateway/auth', createProxyMiddleware({
    target: 'http://login-service:3000', // Internal service name and port
    changeOrigin: true,
    pathRewrite: { '^/gateway/auth': '/auth' }, // Remove /auth prefix before forwarding
}));

// Proxy requests to chat-service
app.use('/gateway/chat', createProxyMiddleware({
    target: 'http://chat-service:3002', // Internal service name and port
    changeOrigin: true,
    pathRewrite: { '^/gateway/chat': '/chat' }, // Remove /chat prefix before forwarding
}));

// Start the API Gateway
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});