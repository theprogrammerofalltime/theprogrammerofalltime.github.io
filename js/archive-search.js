// Lightweight client-side search across the Alt History archive.
// Relies on ARCHIVE_INDEX from archive-search-data.js.
(function () {
  const input = document.getElementById('archive-search-input');
  const results = document.getElementById('archive-search-results');
  if (!input || !results || typeof ARCHIVE_INDEX === 'undefined') return;

  let activeIndex = -1;
  let currentMatches = [];

  function highlight(text, query) {
    if (!query) return text;
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return text;
    return (
      text.slice(0, i) +
      '<mark>' + text.slice(i, i + query.length) + '</mark>' +
      text.slice(i + query.length)
    );
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ARCHIVE_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.meta.toLowerCase().includes(q) ||
      item.excerpt.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q)
    ).slice(0, 8);
  }

  function render(matches, query) {
    currentMatches = matches;
    activeIndex = -1;
    if (!matches.length) {
      results.innerHTML = query.trim()
        ? '<div class="archive-search-empty">No matches for &ldquo;' + query.trim() + '&rdquo;</div>'
        : '';
      results.classList.toggle('open', !!query.trim());
      return;
    }
    results.innerHTML = matches.map((item, i) => {
      const href = item.page + (item.id ? '#' + item.id : '');
      return (
        '<a class="archive-search-result" href="' + href + '" data-index="' + i + '">' +
          '<span class="archive-search-tag">' + item.tag + '</span>' +
          '<span class="archive-search-title">' + highlight(item.title, query) + '</span>' +
          '<span class="archive-search-meta">' + item.meta + '</span>' +
        '</a>'
      );
    }).join('');
    results.classList.add('open');
  }

  input.addEventListener('input', () => render(search(input.value), input.value));

  input.addEventListener('focus', () => {
    if (input.value.trim()) render(search(input.value), input.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.archive-search-result');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex]) {
        window.location.href = items[activeIndex].getAttribute('href');
      } else if (items[0]) {
        window.location.href = items[0].getAttribute('href');
      }
    } else if (e.key === 'Escape') {
      results.classList.remove('open');
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.archive-search')) {
      results.classList.remove('open');
    }
  });
})();
