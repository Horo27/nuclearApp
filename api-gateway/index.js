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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // If preflight request, return early
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Proxy requests to login-service
app.use('/auth-gateway', createProxyMiddleware({
    target: 'http://login-service:3000', // Internal service name and port
    changeOrigin: true,
    pathRewrite: { '^/auth-gateway': '' }, // Remove /auth prefix before forwarding
    onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['access-control-allow-origin'] = 'http://localhost:3001';
    proxyRes.headers['access-control-allow-credentials'] = 'true';
  }
}));

// Proxy requests to chat-service
app.use('/chat-gateway', createProxyMiddleware({
    target: 'http://chat-service:3002', // Internal service name and port
    changeOrigin: true,
    pathRewrite: { '^/chat-gateway': '' }, // Remove /chat prefix before forwarding
      onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['access-control-allow-origin'] = 'http://localhost:3001';
    proxyRes.headers['access-control-allow-credentials'] = 'true';
  }
}));

// Start the API Gateway
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});