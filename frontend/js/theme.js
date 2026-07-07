// Real, working Theme Accent switcher + a lightweight, genuine Daily Reminder
// using the browser's built-in Notification API (no backend needed for either).

const ACCENT_THEMES = {
  indigo: { primary: '99, 102, 241', secondary: '139, 92, 246' },
  emerald: { primary: '16, 185, 129', secondary: '20, 184, 166' },
  rose: { primary: '244, 63, 94', secondary: '236, 72, 153' },
  sunset: { primary: '249, 115, 22', secondary: '234, 179, 8' },
};

function getSavedAccent() {
  return localStorage.getItem('lumora_accent') || 'indigo';
}

function applyAccentTheme(key) {
  const theme = ACCENT_THEMES[key] || ACCENT_THEMES.indigo;
  const root = document.documentElement;
  root.style.setProperty('--accent-primary-rgb', theme.primary);
  root.style.setProperty('--accent-secondary-rgb', theme.secondary);
  root.style.setProperty('--accent-primary', `rgb(${theme.primary})`);
  root.style.setProperty('--accent-secondary', `rgb(${theme.secondary})`);
}

function setAccentTheme(key) {
  localStorage.setItem('lumora_accent', key);
  applyAccentTheme(key);
}

// Apply immediately (before DOMContentLoaded) so there's no flash of the old color
applyAccentTheme(getSavedAccent());

// --- Daily Reminder ---
function isReminderEnabled() {
  return localStorage.getItem('lumora_daily_reminder') === 'true';
}

function setReminderEnabled(enabled) {
  localStorage.setItem('lumora_daily_reminder', enabled.toString());
}

function maybeShowDailyReminder() {
  if (!isReminderEnabled()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const today = new Date().toDateString();
  if (localStorage.getItem('lumora_reminder_last_shown') === today) return;

  new Notification('Lumora', { body: "You haven't learned anything today — jump back in!" });
  localStorage.setItem('lumora_reminder_last_shown', today);
}

document.addEventListener('DOMContentLoaded', maybeShowDailyReminder);