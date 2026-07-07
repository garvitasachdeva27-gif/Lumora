async function exportChats() {
  try {
    const { chats } = await apiRequest('/chats');
    const fullChats = await Promise.all(chats.map((c) => apiRequest(`/chats/${c._id}`)));
    downloadJson(fullChats.map((r) => r.chat), 'lumora-chats.json');
    showToast('Chats exported', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function downloadProfile() {
  try {
    const { profile } = await apiRequest('/profile');
    downloadJson(profile, 'lumora-learning-profile.json');
    showToast('Learning profile downloaded', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function resetPreferences() {
  if (!confirm('Reset all learning preferences? This cannot be undone.')) return;
  try {
    await apiRequest('/profile/reset', { method: 'POST' });
    showToast('Preferences reset', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteAccount() {
  const password = prompt('Type your password to permanently delete your account:');
  if (!password) return;
  if (!confirm('This is permanent. All chats, progress, and profile data will be deleted forever. Continue?')) return;

  try {
    await apiRequest('/account', { method: 'DELETE', body: { password } });
    showToast('Account deleted. Goodbye!', 'success');
    clearAuth();
    setTimeout(() => (window.location.href = 'index.html'), 1200);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function initAccentPicker() {
  const buttons = document.querySelectorAll('[data-accent]');
  const saved = getSavedAccent();

  buttons.forEach((btn) => {
    if (btn.dataset.accent === saved) btn.classList.add('ring-2', 'ring-white/60', 'ring-offset-2', 'ring-offset-bgSurface');

    btn.addEventListener('click', () => {
      setAccentTheme(btn.dataset.accent);
      buttons.forEach((b) => b.classList.remove('ring-2', 'ring-white/60', 'ring-offset-2', 'ring-offset-bgSurface'));
      btn.classList.add('ring-2', 'ring-white/60', 'ring-offset-2', 'ring-offset-bgSurface');
      showToast(`Accent changed to ${btn.dataset.accentName}`, 'success');
    });
  });
}

function initReminderToggle() {
  const toggle = document.getElementById('reminderToggle');
  toggle.checked = isReminderEnabled();

  toggle.addEventListener('change', async () => {
    if (toggle.checked) {
      if (!('Notification' in window)) {
        showToast('Your browser does not support notifications', 'error');
        toggle.checked = false;
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        showToast('Notification permission denied', 'error');
        toggle.checked = false;
        return;
      }
      setReminderEnabled(true);
      showToast('Daily reminders enabled', 'success');
    } else {
      setReminderEnabled(false);
      showToast('Daily reminders disabled', 'success');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  renderSidebar('settings');

  document.getElementById('exportChatsBtn').addEventListener('click', exportChats);
  document.getElementById('downloadProfileBtn').addEventListener('click', downloadProfile);
  document.getElementById('resetPrefsBtn').addEventListener('click', resetPreferences);
  document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);

  initAccentPicker();
  initReminderToggle();
});