/* Pick several stable-for-the-day quotes from the large pool */
(function () {
  'use strict';
  var pool = window.LYNX_QUOTES || [];
  var count = window.LYNX_QUOTES_DAILY_COUNT || 5;
  var dailyEl = document.getElementById('quotes-daily');
  var listEl = document.getElementById('quotes-list');
  var lede = document.getElementById('quotes-lede');
  if (!dailyEl || !pool.length) {
    if (lede) lede.textContent = 'Quote pool failed to load.';
    return;
  }

  // Seeded PRNG (mulberry32) so the same day always gets the same set
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function daySeed() {
    var now = new Date();
    // UTC day number
    return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  }

  function pickDaily(n) {
    var seed = daySeed();
    var rand = mulberry32(seed ^ 0x9E3779B9);
    // Fisher-Yates partial shuffle on indices
    var idxs = [];
    var i, j, t;
    for (i = 0; i < pool.length; i++) idxs.push(i);
    n = Math.min(n, idxs.length);
    for (i = 0; i < n; i++) {
      j = i + Math.floor(rand() * (idxs.length - i));
      t = idxs[i]; idxs[i] = idxs[j]; idxs[j] = t;
    }
    return idxs.slice(0, n).map(function (ix) { return { q: pool[ix], i: ix }; });
  }

  var daily = pickDaily(count);
  var dailySet = {};
  daily.forEach(function (d) { dailySet[d.i] = true; });

  var dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });

  lede.textContent = pool.length.toLocaleString() + ' quotes in the pool · ' +
    count + ' for today (' + dateLabel + ' UTC). Shell: fortune · fortune random';

  dailyEl.innerHTML = '';
  daily.forEach(function (d, n) {
    var art = document.createElement('article');
    art.className = 'quote-card quote-daily';
    art.innerHTML =
      '<span class="tag">Today · ' + (n + 1) + '/' + count + '</span>' +
      '<blockquote>“' + escapeHtml(d.q.t) + '” <cite>— ' + escapeHtml(d.q.a) + '</cite></blockquote>';
    dailyEl.appendChild(art);
  });

  // Sample of the rest (not all 4k — keep page light)
  var sample = [];
  var rand = mulberry32(daySeed() + 99);
  var guard = 0;
  while (sample.length < 40 && guard < 5000) {
    guard++;
    var ix = Math.floor(rand() * pool.length);
    if (dailySet[ix]) continue;
    if (sample.some(function (s) { return s.i === ix; })) continue;
    sample.push({ q: pool[ix], i: ix });
  }
  listEl.innerHTML = '';
  sample.forEach(function (d) {
    var b = document.createElement('blockquote');
    b.className = 'quote-card';
    b.innerHTML = '“' + escapeHtml(d.q.t) + '” <cite>— ' + escapeHtml(d.q.a) + '</cite>';
    listEl.appendChild(b);
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Export for shell if needed
  window.LYNX_DAILY_QUOTES = daily.map(function (d) { return d.q; });
})();
