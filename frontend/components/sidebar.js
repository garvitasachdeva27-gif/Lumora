// Renders the shared sidebar into any element with id="sidebar-root".
// activePage should match one of: dashboard, learn, progress, profile, settings

function renderSidebar(activePage) {
  const user = getUser();

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html' },
    { key: 'learn', label: 'Learn', href: 'learn.html' },
    { key: 'progress', label: 'Progress', href: 'progress.html' },
    { key: 'profile', label: 'Learning Profile', href: 'profile.html' },
    { key: 'settings', label: 'Settings', href: 'settings.html' },
  ];

  const navHtml = navItems
    .map((item) => {
      const isActive = item.key === activePage;
      return `
        <a href="${item.href}"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
          ${isActive
            ? 'bg-accentPrimary/15 text-white border-l-2 border-accentPrimary'
            : 'text-zinc-400 hover:bg-bgElevated hover:text-white'}">
          ${item.label}
        </a>`;
    })
    .join('');

  const sidebarHtml = `
    <div class="h-full flex flex-col justify-between bg-bgSurface border-r border-white/[0.08] p-4">
      <div>
        <div class="px-2 py-3 mb-4">
          <h1 class="text-lg font-semibold text-white">Lumora</h1>
        </div>
        <nav class="space-y-1">${navHtml}</nav>
      </div>
      <div class="border-t border-white/[0.08] pt-4 px-2">
        <p class="text-sm text-white font-medium truncate">${user?.name || 'Learner'}</p>
        <p class="text-xs text-zinc-500 truncate mb-3">${user?.email || ''}</p>
        <button onclick="logout()"
          class="text-sm text-zinc-400 hover:text-error transition">Log out</button>
      </div>
    </div>`;

  const root = document.getElementById('sidebar-root');
  if (root) root.innerHTML = sidebarHtml;
}