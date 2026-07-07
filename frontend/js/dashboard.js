// Loads profile + progress data and populates every Dashboard card.

async function loadDashboard() {
  try {
    const [profileRes, progressRes] = await Promise.all([
      apiRequest('/profile'),
      apiRequest('/progress'),
    ]);

    renderWelcomeCard(getUser());
    renderContinueLearning(profileRes.profile);
    renderSuggestedFocus(profileRes.profile);
    renderRecentActivity(progressRes.progress);
    renderAiInsight(profileRes.profile);
    renderWeakTopics(profileRes.profile);
    renderStreak(progressRes.progress);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderWelcomeCard(user) {
  const el = document.getElementById('welcomeCard');
  el.innerHTML = `
    <h2 class="text-2xl font-semibold text-white">Welcome back, ${user?.name?.split(' ')[0] || 'there'} 👋</h2>
    <p class="text-zinc-400 text-sm mt-1">Ready to pick up where you left off?</p>
    <a href="learn.html" class="inline-block mt-4 gradient-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition">
      Continue Learning
    </a>`;
}

function renderContinueLearning(profile) {
  const el = document.getElementById('continueLearningCard');
  const lastTopic = profile.recentTopics?.[profile.recentTopics.length - 1];

  el.innerHTML = lastTopic
    ? `
      <p class="text-xs text-zinc-500 uppercase tracking-wide mb-2">Continue Learning</p>
      <p class="text-white font-medium">${lastTopic}</p>
      <a href="learn.html" class="text-accent text-sm mt-3 inline-block hover:underline">Resume →</a>`
    : `
      <p class="text-xs text-zinc-500 uppercase tracking-wide mb-2">Continue Learning</p>
      <p class="text-zinc-400 text-sm">No topics yet — start your first chat to begin.</p>
      <a href="learn.html" class="text-accent text-sm mt-3 inline-block hover:underline">Start learning →</a>`;
}

function renderSuggestedFocus(profile) {
  const el = document.getElementById('suggestedFocusCard');
  const weakTopic = profile.weakTopics?.[0];

  el.innerHTML = weakTopic
    ? `
      <p class="text-xs text-zinc-500 uppercase tracking-wide mb-2">Suggested Focus</p>
      <p class="text-white font-medium">${weakTopic}</p>
      <p class="text-zinc-400 text-sm mt-1">Based on your recent activity.</p>
      <a href="learn.html" class="text-accent text-sm mt-3 inline-block hover:underline">Practice this →</a>`
    : `
      <p class="text-xs text-zinc-500 uppercase tracking-wide mb-2">Suggested Focus</p>
      <p class="text-zinc-400 text-sm">Nothing flagged yet — keep learning and Lumora will find patterns.</p>`;
}

function renderRecentActivity(progress) {
  const el = document.getElementById('recentActivityCard');
  const recent = (progress.activityHistory || []).slice(-5).reverse();

  if (recent.length === 0) {
    el.innerHTML = `<p class="text-zinc-400 text-sm">No activity yet.</p>`;
    return;
  }

  el.innerHTML = recent
    .map((a) => {
      const date = new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return `
        <div class="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0">
          <span class="text-sm text-zinc-300 truncate">${a.detail || a.type}</span>
          <span class="text-xs text-zinc-500 shrink-0 ml-3">${date}</span>
        </div>`;
    })
    .join('');
}

function renderAiInsight(profile) {
  const el = document.getElementById('aiInsightCard');
  const insight = profile.aiInsights?.[profile.aiInsights.length - 1];

  el.innerHTML = insight
    ? `<p class="text-sm text-zinc-300">${insight}</p>`
    : `<p class="text-sm text-zinc-500">Lumora is still getting to know how you learn.</p>`;
}

function renderWeakTopics(profile) {
  const el = document.getElementById('weakTopicsCard');
  const topics = profile.weakTopics || [];

  el.innerHTML = topics.length
    ? topics.map((t) => `
        <span class="inline-block bg-bgElevated text-zinc-300 text-xs px-3 py-1.5 rounded-full mr-2 mb-2">${t}</span>
      `).join('')
    : `<p class="text-sm text-zinc-500">No weak topics identified yet.</p>`;
}

function renderStreak(progress) {
  const el = document.getElementById('streakCard');
  el.innerHTML = `
    <p class="text-4xl font-bold font-display gold-glow pulse-number">${progress.studyStreak || 0}</p>
    <p class="text-sm text-zinc-400 mt-1">day streak</p>
    <p class="text-xs text-zinc-500 mt-3">${progress.totalStudySessions || 0} total sessions</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  renderSidebar('dashboard');
  loadDashboard();
});