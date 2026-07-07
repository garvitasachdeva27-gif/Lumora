let currentChatId = null;

const ACTION_BUTTONS = [
  { key: 'explainDifferently', label: 'Explain Differently' },
  { key: 'moreDepth', label: 'More Depth' },
  { key: 'simpler', label: 'Simpler Explanation' },
  { key: 'examples', label: 'Give Examples' },
  { key: 'stepByStep', label: 'Step-by-Step' },
  { key: 'visual', label: 'Visual Explanation' },
  { key: 'quizMe', label: 'Quiz Me' },
  { key: 'analogy', label: 'Real-world Analogy' },
  { key: 'translate', label: 'Translate' },
];

async function loadChatHistory() {
  try {
    const { chats } = await apiRequest('/chats');
    const list = document.getElementById('chatHistoryList');

    if (chats.length === 0) {
      list.innerHTML = `<p class="text-xs text-zinc-500 px-2">No chats yet</p>`;
      return;
    }

    list.innerHTML = chats
      .map(
        (c) => `
        <button onclick="openChat('${c._id}')"
          class="w-full text-left text-sm px-3 py-2 rounded-lg truncate transition
          ${c._id === currentChatId ? 'bg-bgElevated text-white' : 'text-zinc-400 hover:bg-bgElevated hover:text-white'}">
          ${c.title}
        </button>`
      )
      .join('');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function openChat(chatId) {
  try {
    const { chat } = await apiRequest(`/chats/${chatId}`);
    currentChatId = chat._id;
    document.getElementById('currentChatTitle').textContent = chat.title;
    renderMessages(chat.messages);
    loadChatHistory();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function startNewChat() {
  currentChatId = null;
  document.getElementById('currentChatTitle').textContent = 'New Chat';
  renderMessages([]);
  loadChatHistory();
}

function renderMessages(messages) {
  const container = document.getElementById('messagesContainer');

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="flex items-center justify-center h-full text-center">
        <p class="text-zinc-500 text-sm">Ask Lumora anything to start learning.</p>
      </div>`;
    return;
  }

  container.innerHTML = messages
    .map((m, index) => {
      const isUser = m.role === 'user';
      const isLastAssistant = !isUser && index === messages.length - 1;

      return `
        <div class="msg-in flex ${isUser ? 'justify-end' : 'justify-start'} mb-4">
          <div class="${isUser
            ? 'gradient-accent text-white max-w-lg rounded-2xl rounded-tr-sm px-4 py-3'
            : 'card-glass text-zinc-100 max-w-2xl rounded-2xl rounded-tl-sm px-4 py-3'}">
            <p class="text-sm whitespace-pre-wrap">${escapeHtml(m.content)}</p>
            ${isLastAssistant ? renderActionButtons() : ''}
          </div>
        </div>`;
    })
    .join('');

  container.scrollTop = container.scrollHeight;
}

function renderActionButtons() {
  return `
    <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
      ${ACTION_BUTTONS.map(
        (a) => `
        <button onclick="sendAction('${a.key}')"
          class="text-xs bg-bgElevated hover:bg-white/[0.1] text-zinc-300 px-2.5 py-1 rounded-full transition hover:scale-105">
          ${a.label}
        </button>`
      ).join('')}
    </div>`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function sendMessage(text, action = null) {
  const sendBtn = document.getElementById('sendBtn');
  const input = document.getElementById('chatInput');

  if (!text || !text.trim()) return;

  const container = document.getElementById('messagesContainer');
  const wasEmpty = container.querySelector('.justify-center');
  if (wasEmpty) container.innerHTML = '';
  container.insertAdjacentHTML(
    'beforeend',
    `<div class="msg-in flex justify-end mb-4">
      <div class="gradient-accent text-white max-w-lg rounded-2xl rounded-tr-sm px-4 py-3">
        <p class="text-sm whitespace-pre-wrap">${escapeHtml(text)}</p>
      </div>
    </div>
    <div id="typingIndicator" class="msg-in flex justify-start mb-4">
      <div class="card-glass rounded-2xl rounded-tl-sm px-4 py-3">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`
  );
  container.scrollTop = container.scrollHeight;

  setButtonLoading(sendBtn, true, '...');
  input.disabled = true;

  try {
    const data = await apiRequest('/chat', {
      method: 'POST',
      body: { message: text, chatId: currentChatId, action },
    });

    currentChatId = data.chatId;
    document.getElementById('currentChatTitle').textContent = data.title;

    const { chat } = await apiRequest(`/chats/${currentChatId}`);
    renderMessages(chat.messages);
    loadChatHistory();
    input.value = '';
  } catch (error) {
    document.getElementById('typingIndicator')?.remove();
    showToast(error.message, 'error');
  } finally {
    setButtonLoading(sendBtn, false);
    input.disabled = false;
    input.focus();
  }
}

function sendAction(actionKey) {
  const lastUserBubble = [...document.querySelectorAll('#messagesContainer .justify-end p')].pop();
  const lastUserText = lastUserBubble ? lastUserBubble.textContent : '';
  if (!lastUserText) return;
  sendMessage(lastUserText, actionKey);
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  renderSidebar('learn');
  loadChatHistory();
  renderMessages([]);

  document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    sendMessage(input.value);
  });

  document.getElementById('newChatBtn').addEventListener('click', startNewChat);
});