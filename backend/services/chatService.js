const Chat = require('../models/Chat');

async function getOrCreateChat(userId, chatId, firstMessage) {
  if (chatId) {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) throw new Error('CHAT_NOT_FOUND');
    return chat;
  }
  const title = firstMessage.length > 40 ? `${firstMessage.slice(0, 40)}...` : firstMessage;
  return Chat.create({ userId, title, messages: [] });
}

function getRecentMessages(chat, limit = 6) {
  return chat.messages.slice(-limit);
}

module.exports = { getOrCreateChat, getRecentMessages };