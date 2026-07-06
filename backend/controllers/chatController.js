const progressService = require('../services/progressService');
const LearningProfile = require('../models/LearningProfile');
const chatService = require('../services/chatService');
const profileService = require('../services/profileService');
const aiService = require('../services/aiService');
const { buildChatMessages } = require('../utils/promptBuilder');
const { buildAnalysisPrompt, parseAnalysis } = require('../utils/profileAnalyzer');

// @route POST /api/chat
const sendMessage = async (req, res, next) => {
  try {
    const { message, chatId, action } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const profile = await LearningProfile.findOne({ userId: req.user._id });
    const chat = await chatService.getOrCreateChat(req.user._id, chatId, message);
    const recentMessages = chatService.getRecentMessages(chat);

    const promptMessages = buildChatMessages({ profile, recentMessages, userQuery: message, action });
    const aiReply = await aiService.generateResponse(promptMessages);

    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: aiReply });
    await chat.save();
    // Record this as a study activity — updates streak, sessions, activity log
    await progressService.recordActivity(req.user._id, 'chat', chat.title);
    // Send the response to the user FIRST — don't make them wait for analysis
    res.status(200).json({
      success: true,
      chatId: chat._id,
      title: chat.title,
      reply: aiReply,
    });

    // Fire-and-forget background analysis — never blocks or crashes the request
    (async () => {
      try {
        const analysisMessages = buildAnalysisPrompt(message, aiReply, profile);
        const rawAnalysis = await aiService.analyzeInteraction(analysisMessages);
        const parsed = parseAnalysis(rawAnalysis);
        await profileService.applyAnalysis(req.user._id, parsed);
      } catch (err) {
        console.error('Background profile analysis failed:', err.message);
      }
    })();
  } catch (error) {
    if (error.message === 'CHAT_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }
    if (error.message === 'AI_SERVICE_ERROR') {
      return res.status(503).json({
        success: false,
        message: 'Lumora AI is temporarily unavailable. Please try again in a moment.',
      });
    }
    next(error);
  }
};

// @route GET /api/chats
const getChats = async (req, res, next) => {
  try {
    const Chat = require('../models/Chat');
    const chats = await Chat.find({ userId: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/chats/:id
const getChat = async (req, res, next) => {
  try {
    const Chat = require('../models/Chat');
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/chats/:id
const deleteChat = async (req, res, next) => {
  try {
    const Chat = require('../models/Chat');
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
    res.status(200).json({ success: true, message: 'Chat deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getChats, getChat, deleteChat };