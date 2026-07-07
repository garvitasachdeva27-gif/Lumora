const STYLE_OPTIONS = ['Examples', 'Theory', 'Bullet Points', 'Step-by-Step', 'Visual Learning', 'Analogies', 'Practice Questions', 'Quizzes'];
let currentProfile = null;

async function loadProfile() {
  try {
    const { profile } = await apiRequest('/profile');
    currentProfile = profile;
    renderStyleChips(profile.preferredStyle || []);
    document.getElementById('languageSelect').value = profile.preferredLanguage || 'English';
    document.getElementById('paceSelect').value = profile.learningPace || 'Balanced';
    document.getElementById('goalInput').value = profile.currentGoal || '';
    renderObservations(profile.aiInsights || []);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderStyleChips(activeStyles) {
  const el = document.getElementById('styleChips');
  el.innerHTML = STYLE_OPTIONS.map((style) => {
    const isActive = activeStyles.includes(style);
    return `
      <button type="button" onclick="toggleChip(this, '${style}')"
        data-style="${style}" data-active="${isActive}"
        class="text-sm px-3.5 py-1.5 rounded-full border transition
        ${isActive ? 'chip-active' : 'bg-bgElevated border-white/[0.08] text-zinc-400 hover:text-white'}">
        ${isActive ? '✅' : '○'} ${style}
      </button>`;
  }).join('');
}

function toggleChip(button, style) {
  const isActive = button.dataset.active === 'true';
  button.dataset.active = (!isActive).toString();
  button.className = `text-sm px-3.5 py-1.5 rounded-full border transition ${
    !isActive ? 'chip-active' : 'bg-bgElevated border-white/[0.08] text-zinc-400 hover:text-white'
  }`;
  button.innerHTML = `${!isActive ? '✅' : '○'} ${style}`;
}

function renderObservations(insights) {
  const el = document.getElementById('observationsList');
  el.innerHTML = insights.length
    ? insights.slice(-5).reverse().map((i) => `<p class="text-sm text-zinc-300 py-1.5 border-b border-white/[0.06] last:border-0">${i}</p>`).join('')
    : `<p class="text-sm text-zinc-500">No observations yet — keep chatting with Lumora.</p>`;
}

async function saveProfile(e) {
  e.preventDefault();
  const saveBtn = document.getElementById('saveBtn');
  const selectedStyles = [...document.querySelectorAll('[data-style]')]
    .filter((btn) => btn.dataset.active === 'true')
    .map((btn) => btn.dataset.style);

  setButtonLoading(saveBtn, true, 'Saving...');
  try {
    const { profile } = await apiRequest('/profile', {
      method: 'PUT',
      body: {
        preferredStyle: selectedStyles,
        preferredLanguage: document.getElementById('languageSelect').value,
        learningPace: document.getElementById('paceSelect').value,
        currentGoal: document.getElementById('goalInput').value.trim(),
      },
    });
    currentProfile = profile;
    showToast('Learning profile updated', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setButtonLoading(saveBtn, false);
  }
}

async function resetProfile() {
  if (!confirm('This will clear all your learning preferences and AI-learned data. Continue?')) return;
  try {
    await apiRequest('/profile/reset', { method: 'POST' });
    showToast('Learning profile reset', 'success');
    loadProfile();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  renderSidebar('profile');
  loadProfile();
  document.getElementById('profileForm').addEventListener('submit', saveProfile);
  document.getElementById('resetBtn').addEventListener('click', resetProfile);
});