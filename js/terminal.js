/* Lynx terminal desktop shell.
 * Add a new session: create a normal HTML page, add data-terminal-command="name"
 * to <body>, and add one link to the sidebar. The boot animation is automatic.
 */
(function () {
  const body = document.body;
  const command = body.dataset.terminalCommand || 'open';
  const content = document.querySelector('.boot-content');
  const commandEl = document.querySelector('.boot-command');
  const cursor = document.querySelector('.boot-cursor');

  function finish() {
    body.classList.add('boot-ready');
    if (cursor) cursor.style.display = 'none';
    if (content) {
      content.classList.add('is-visible');
      content.querySelectorAll('.boot-stagger').forEach((el, i) => {
        el.style.animationDelay = (i * 55) + 'ms';
      });
    }
  }

  if (!commandEl) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { commandEl.textContent = command; finish(); return; }

  let i = 0;
  function type() {
    if (i < command.length) {
      commandEl.textContent += command[i++];
      window.setTimeout(type, 45 + Math.random() * 55);
    } else {
      window.setTimeout(finish, 220);
    }
  }
  type();

  // Keyboard navigation: the sidebar feels like a TUI, not a normal navbar.
  const tabs = Array.from(document.querySelectorAll('.site-nav a'));
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const current = Math.max(0, tabs.findIndex(a => a.classList.contains('active')));
      const next = e.key === 'ArrowDown' ? (current + 1) % tabs.length : (current - 1 + tabs.length) % tabs.length;
      tabs[next].focus();
    }
    if (e.key === 'Enter' && document.activeElement && document.activeElement.closest('.site-nav')) {
      document.activeElement.click();
    }
  });
})();
