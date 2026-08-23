/* Aggregate public GitHub language bytes for theprogrammerofalltime */
(function () {
  'use strict';

  var USER = 'theprogrammerofalltime';
  var barsEl = document.getElementById('skills-bars');
  var pieEl = document.getElementById('skills-pie');
  var legendEl = document.getElementById('skills-pie-legend');
  var pieWrap = document.getElementById('skills-pie-wrap');
  var metaEl = document.getElementById('skills-lang-meta');
  var btnBars = document.getElementById('view-bars');
  var btnPie = document.getElementById('view-pie');
  if (!barsEl) return;

  // Fallback if API is rate-limited — based on known non-fork project languages
  // (BrickBreakerClone, Cave-Flyer, minesweeper-in-web, Converter, github.io site, etc.)
  var FALLBACK = {
    Python: 42000,
    HTML: 38000,
    CSS: 18000,
    JavaScript: 12000,
    Shell: 3000
  };

  var COLORS = [
    '#1DB954', '#3ddc84', '#7edc9d', '#22e065', '#17984a',
    '#a8e6bf', '#0f7a3a', '#5ad68a', '#c5f0d4', '#086b32'
  ];

  function formatBytes(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + ' MB';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + ' KB';
    return n + ' B';
  }

  function sortedEntries(map) {
    return Object.keys(map)
      .map(function (k) { return [k, map[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
  }

  function render(map, sourceNote) {
    var entries = sortedEntries(map);
    var total = entries.reduce(function (s, e) { return s + e[1]; }, 0);
    if (!total) {
      metaEl.textContent = 'No language data available.';
      return;
    }

    metaEl.textContent = sourceNote + ' · ' + formatBytes(total) + ' across ' + entries.length + ' languages';

    barsEl.innerHTML = '';
    entries.forEach(function (pair, i) {
      var name = pair[0];
      var bytes = pair[1];
      var pct = Math.max(2, Math.round((bytes / total) * 100));
      var row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML =
        '<span class="skill-name">' + name + '</span>' +
        '<span class="skill-bar"><i style="width:' + pct + '%;background:' + COLORS[i % COLORS.length] + '"></i></span>' +
        '<span class="skill-lvl">' + pct + '%</span>';
      barsEl.appendChild(row);
    });

    // Conic gradient pie
    var stops = [];
    var acc = 0;
    entries.forEach(function (pair, i) {
      var start = acc;
      acc += (pair[1] / total) * 100;
      stops.push(COLORS[i % COLORS.length] + ' ' + start.toFixed(2) + '% ' + acc.toFixed(2) + '%');
    });
    pieEl.style.background = 'conic-gradient(' + stops.join(', ') + ')';

    legendEl.innerHTML = '';
    entries.forEach(function (pair, i) {
      var pct = ((pair[1] / total) * 100).toFixed(1);
      var li = document.createElement('li');
      li.innerHTML =
        '<i style="background:' + COLORS[i % COLORS.length] + '"></i>' +
        '<span>' + pair[0] + '</span>' +
        '<span class="pct">' + pct + '% · ' + formatBytes(pair[1]) + '</span>';
      legendEl.appendChild(li);
    });
  }

  function setView(mode) {
    var pie = mode === 'pie';
    btnBars.classList.toggle('active', !pie);
    btnPie.classList.toggle('active', pie);
    barsEl.classList.toggle('is-hidden', pie);
    pieWrap.classList.toggle('is-visible', pie);
    pieWrap.setAttribute('aria-hidden', pie ? 'false' : 'true');
    try { localStorage.setItem('lynx-skills-view', mode); } catch (e) {}
  }

  btnBars.addEventListener('click', function () { setView('bars'); });
  btnPie.addEventListener('click', function () { setView('pie'); });
  try {
    var saved = localStorage.getItem('lynx-skills-view');
    if (saved === 'pie' || saved === 'bars') setView(saved);
  } catch (e) {}

  function aggregateLanguages(repos) {
    var totals = {};
    var pending = 0;
    var done = 0;
    var own = repos.filter(function (r) {
      // Skip huge upstream forks that would drown the chart (e.g. linux kernel)
      if (r.fork && r.name && /linux|kernel|torvalds/i.test(r.name)) return false;
      // Prefer non-forks; include smaller forks only if primary language is set
      if (r.fork) return false;
      return true;
    });

    if (!own.length) {
      render(FALLBACK, 'Fallback estimate (API returned no owned repos)');
      return;
    }

    pending = own.length;
    own.forEach(function (r) {
      fetch('https://api.github.com/repos/' + USER + '/' + encodeURIComponent(r.name) + '/languages')
        .then(function (res) {
          if (!res.ok) throw new Error('lang ' + res.status);
          return res.json();
        })
        .then(function (langs) {
          Object.keys(langs).forEach(function (lang) {
            totals[lang] = (totals[lang] || 0) + langs[lang];
          });
        })
        .catch(function () { /* skip failed repo */ })
        .finally(function () {
          done += 1;
          if (done >= pending) {
            if (Object.keys(totals).length) {
              render(totals, 'Live from github.com/' + USER + ' (non-fork repos)');
            } else {
              render(FALLBACK, 'Fallback estimate (language endpoints unavailable)');
            }
          }
        });
    });
  }

  fetch('https://api.github.com/users/' + USER + '/repos?per_page=100&type=owner')
    .then(function (res) {
      if (!res.ok) throw new Error('repos ' + res.status);
      return res.json();
    })
    .then(function (repos) {
      if (!Array.isArray(repos)) throw new Error('bad payload');
      aggregateLanguages(repos);
    })
    .catch(function () {
      render(FALLBACK, 'Fallback estimate (GitHub API rate-limited or offline)');
    });
})();
