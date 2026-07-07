async function loadProgress() {
  try {
    const { progress } = await apiRequest('/progress');
    renderOverviewCards(progress);
    renderWeeklyChart(progress.activityHistory || []);
    renderTimeline(progress.activityHistory || []);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderOverviewCards(progress) {
  document.getElementById('statStreak').textContent = progress.studyStreak || 0;
  document.getElementById('statSessions').textContent = progress.totalStudySessions || 0;
  document.getElementById('statTopics').textContent = progress.topicsCompleted || 0;
  document.getElementById('statQuizScore').textContent = `${progress.averageQuizScore || 0}%`;
}

// Simple bar chart built with plain divs — counts activity entries per day, last 7 days
function renderWeeklyChart(activityHistory) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  const counts = days.map((day) =>
    activityHistory.filter((a) => new Date(a.date).toDateString() === day.toDateString()).length
  );
  const max = Math.max(...counts, 1);

  const chart = document.getElementById('weeklyChart');
  chart.innerHTML = days
    .map((day, i) => {
      const heightPct = Math.round((counts[i] / max) * 100);
      const label = day.toLocaleDateString(undefined, { weekday: 'short' });
      return `
        <div class="flex flex-col items-center gap-2 flex-1">
          <div class="w-full bg-bgElevated rounded-t-md flex items-end" style="height: 100px;">
            <div class="w-full gradient-accent rounded-t-md transition-all" style="height: ${heightPct}%;"></div>
          </div>
          <span class="text-xs text-zinc-500">${label}</span>
        </div>`;
    })
    .join('');
}

function renderTimeline(activityHistory) {
  const el = document.getElementById('timelineList');
  const sorted = [...activityHistory].reverse();

  if (sorted.length === 0) {
    el.innerHTML = `<p class="text-sm text-zinc-500">No activity yet — start a chat to build your timeline.</p>`;
    return;
  }

  el.innerHTML = sorted
    .map((a) => {
      const date = new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      const time = new Date(a.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="flex justify-between items-start py-3 border-b border-white/[0.06] last:border-0">
          <div>
            <p class="text-sm text-zinc-200">${a.detail || a.type}</p>
            <p class="text-xs text-zinc-500 capitalize">${a.type}</p>
          </div>
          <span class="text-xs text-zinc-500 shrink-0 ml-3">${date}, ${time}</span>
        </div>`;
    })
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  renderSidebar('progress');
  loadProgress();
});