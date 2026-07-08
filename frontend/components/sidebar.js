function ensureSidebarShell() {
  if (document.getElementById('mobileSidebarToggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'mobileSidebarToggle';
  toggle.type = 'button';
  toggle.className = 'mobile-sidebar-toggle';
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  document.body.appendChild(toggle);

  const backdrop = document.createElement('div');
  backdrop.id = 'mobileSidebarBackdrop';
  backdrop.className = 'mobile-sidebar-backdrop';
  document.body.appendChild(backdrop);
}

function openMobileSidebar() {
  const root = document.getElementById('sidebar-root');
  const toggle = document.getElementById('mobileSidebarToggle');
  const backdrop = document.getElementById('mobileSidebarBackdrop');

  if (!root || !toggle || !backdrop) return;

  root.classList.add('is-open');
  backdrop.classList.add('is-visible');
  toggle.classList.add('is-open');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('sidebar-open');
}

function closeMobileSidebar() {
  const root = document.getElementById('sidebar-root');
  const toggle = document.getElementById('mobileSidebarToggle');
  const backdrop = document.getElementById('mobileSidebarBackdrop');

  if (!root || !toggle || !backdrop) return;

  root.classList.remove('is-open');
  backdrop.classList.remove('is-visible');
  toggle.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('sidebar-open');
}

function toggleMobileSidebar() {
  const root = document.getElementById('sidebar-root');
  if (!root) return;
  root.classList.contains('is-open') ? closeMobileSidebar() : openMobileSidebar();
}

function bindSidebarEvents(root) {
  if (!root || root.dataset.bound === 'true') return;

  root.dataset.bound = 'true';
  ensureSidebarShell();

  const toggle = document.getElementById('mobileSidebarToggle');
  const backdrop = document.getElementById('mobileSidebarBackdrop');

  if (toggle) toggle.addEventListener('click', toggleMobileSidebar);
  if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

  root.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('click', closeMobileSidebar);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileSidebar();
  });
}

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
          class="sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
          ${isActive ? 'active-nav' : 'text-zinc-400 hover:bg-bgElevated hover:text-white'}">
          ${item.label}
        </a>`;
    })
    .join('');

  const sidebarHtml = `
    <div class="sidebar-panel h-full flex flex-col justify-between bg-bgSurface border-r border-white/[0.08] p-4">
      <div>
        <a href="index.html" class="flex items-center gap-2 px-2 py-3 mb-4 hover:opacity-80 transition">
          <img src="logo.jpeg" alt="Lumora" class="w-7 h-7 rounded-lg object-cover" />
          <h1 class="font-display text-lg font-semibold text-white">Lumora</h1>
        </a>
        <nav class="space-y-1">${navHtml}</nav>
      </div>
      <div class="border-t border-white/[0.08] pt-4 px-2">
        <p class="text-sm text-white font-medium truncate">${user?.name || 'Learner'}</p>
        <p class="text-xs text-zinc-500 truncate mb-3">${user?.email || ''}</p>
        <button type="button" onclick="logout()"
          class="text-sm text-zinc-400 hover:text-error transition">Log out</button>
      </div>
    </div>`;

  const root = document.getElementById('sidebar-root');
  if (root) {
    root.innerHTML = sidebarHtml;
    bindSidebarEvents(root);
  }
}