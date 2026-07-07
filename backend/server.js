// Add this right at the top of server.js
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Lumora backend is running 🚀' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/chatRoutes'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/api', require('./routes/progressRoutes'));
app.use('/api', require('./routes/userRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});