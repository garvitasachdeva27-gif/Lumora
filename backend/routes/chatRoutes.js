const express = require('express');
const protect = require('../middleware/authMiddleware');
const { sendMessage, getChats, getChat, deleteChat } = require('../controllers/chatController');

const router = express.Router();

router.post('/chat', protect, sendMessage);
router.get('/chats', protect, getChats);
router.get('/chats/:id', protect, getChat);
router.delete('/chats/:id', protect, deleteChat);

module.exports = router;