/* Interactive shell for lynx@web
 * Full command-line session used by shell.html
 */
(function () {
  'use strict';

  const output = document.getElementById('shell-output');
  const form = document.getElementById('shell-form');
  const input = document.getElementById('shell-input');
  const promptEl = document.getElementById('shell-prompt');

  if (!output || !form || !input) return;

  const HISTORY_KEY = 'lynx-shell-history';
  const MAX_HISTORY = 80;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(history)) history = [];
  } catch (_) {
    history = [];
  }
  let historyIndex = history.length;

  const SESSIONS = {
    welcome:   { path: 'index.html',              desc: 'landing page · session ready' },
    fastfetch: { path: 'home.html',               desc: 'system information · animated' },
    about:     { path: 'about.html',              desc: 'who is Lynx?' },
    now:       { path: 'now.html',                desc: 'current focus · status' },
    projects:  { path: 'projects.html',           desc: "things I've built" },
    portfolio: { path: 'portfolio.html',          desc: 'games · tools · showreels' },
    skills:    { path: 'skills.html',             desc: 'languages · engines · tools' },
    uses:      { path: 'uses.html',               desc: 'machine · editor · workflow' },
    journal:   { path: 'journal.html',            desc: 'dated notes · log' },
    lab:       { path: 'lab.html',                desc: 'experiments · unfinished' },
    bookmarks: { path: 'bookmarks.html',          desc: 'curated links' },
    contact:   { path: 'contact.html',            desc: 'discord · github' },
    gallery:   { path: 'gallery.html',            desc: 'screenshots · stills' },
    quotes:    { path: 'quotes.html',             desc: 'daily fortune pool' },
    archive:   { path: 'alt-history/index.html',  desc: 'The Old World Eternal' },
    shell:     { path: 'shell.html',              desc: 'interactive terminal (you are here)' }
  };

  const FILES = {
    'readme': `lynx@web — terminal desktop personal site

Built as a static GitHub Pages site.
No framework. No build step. Just HTML, CSS, and a little JS.

Sessions:
  welcome, fastfetch, about, projects, portfolio, archive, shell

Type "help" for commands. Type "ls" to list sessions.
GitHub: https://github.com/theprogrammerofalltime`,

    'about': `I'm Lynx.

This is my third website. The first was a GitHub Pages site
(now folded into Portfolio). The second was a standalone site
for my alternate-history project; I merged it into this one
as The Old World Eternal (see: archive).

I build things on the web when I can, and spend a lot of the
rest of the time reading, playing games, and writing history
that didn't quite happen.

Discord: theprogrammerofalltime
GitHub:  https://github.com/theprogrammerofalltime`,

    'projects': `Ongoing
  • The Alt History Wiki — full archive of timeline, figures, events
  • Showcase / Portfolio — Brick Breaker, Cave Flyer, Minesweeper, showreels

Coming soon
  Additional projects will appear as they ship.

Open the projects or portfolio session for the full view.`,

    'contact': `Discord  theprogrammerofalltime
GitHub   https://github.com/theprogrammerofalltime
Site     this terminal`,

    'motd': `Welcome to lynx@web.
Type help to see available commands.
Arrow keys cycle command history. Tab completes known commands.`,

    'now': `Focus: building this terminal desktop
Writing: The Old World Eternal
Learning: C++ & game systems
Stack: Arch · vim · VSCodium

Open the now session for the full status board.`,

    'uses': `Machine: Ryzen 9 7900 · RX 7800 XT · 32 GB DDR5
OS: Arch Linux
Editor: vim + VSCodium · JetBrains Mono
Host: GitHub Pages · static · no build step

Open the uses session for the full setup list.`
  };

  const QUOTES = [
    'The best way to predict the future is to invent it. — Alan Kay',
    'Talk is cheap. Show me the code. — Linus Torvalds',
    'Premature optimization is the root of all evil. — Donald Knuth',
    'Simplicity is the ultimate sophistication. — Leonardo da Vinci',
    'In the middle of difficulty lies opportunity. — Albert Einstein',
    'First, solve the problem. Then, write the code. — John Johnson',
    'History is written by the victors — unless you write the alternate one.',
    'There is no place like ~',
    'lynx@web: permission granted to explore.'
  ];

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function line(html, cls) {
    const div = document.createElement('div');
    div.className = 'shell-line' + (cls ? ' ' + cls : '');
    div.innerHTML = html;
    output.appendChild(div);
    return div;
  }

  function print(text, cls) {
    const parts = String(text).split('\n');
    parts.forEach(function (p) {
      line(esc(p) || '&nbsp;', cls);
    });
  }

  function printHTML(html, cls) {
    line(html, cls);
  }

  function scrollToBottom() {
    const stage = document.querySelector('.terminal-stage main') || output.parentElement;
    if (stage) stage.scrollTop = stage.scrollHeight;
    output.scrollTop = output.scrollHeight;
  }

  function saveHistory(cmd) {
    if (!cmd) return;
    if (history.length && history[history.length - 1] === cmd) return;
    history.push(cmd);
    if (history.length > MAX_HISTORY) history = history.slice(-MAX_HISTORY);
    historyIndex = history.length;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (_) {}
  }

  function formatUptime() {
    const birth = new Date(Date.UTC(2007, 10, 2));
    const now = new Date();
    let years = now.getUTCFullYear() - birth.getUTCFullYear();
    let months = now.getUTCMonth() - birth.getUTCMonth();
    let days = now.getUTCDate() - birth.getUTCDate();
    if (days < 0) {
      months -= 1;
      const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0));
      days += prev.getUTCDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const parts = [];
    if (years) parts.push(years + (years === 1 ? ' year' : ' years'));
    if (months) parts.push(months + (months === 1 ? ' month' : ' months'));
    if (days || !parts.length) parts.push(days + (days === 1 ? ' day' : ' days'));
    return parts.join(', ');
  }

  function buildNeofetch() {
    const ascii = [
      '      _                    ',
      '     | |   _   _ _ __ __  __',
      "     | |  | | | | '_ \\\\ \\/ /",
      '     | |__| |_| | | | |>  < ',
      '     |_____\\__, |_| |_/_/\\_\\',
      '           |___/            '
    ].join('\n');

    const rows = [
      ['OS', 'Arch Linux x86_64'],
      ['Host', 'lynx@web'],
      ['Kernel', 'Linux 7.1.8'],
      ['Uptime', formatUptime()],
      ['Shell', 'lynx-sh 1.0'],
      ['IDE', 'vim and VSCodium'],
      ['Languages', 'HTML, JS, CSS, C++, Python'],
      ['Spoken', 'English, Irish, Mandarin'],
      ['Hobbies', 'programming, alt history'],
      ['Discord', 'theprogrammerofalltime'],
      ['CPU', 'AMD Ryzen 9 7900 (24) @ 5.49 GHz'],
      ['GPU', 'AMD Radeon RX 7800 XT'],
      ['Memory', '32 GB DDR5 6000 MT/s CL30']
    ];

    let right = '<div class="ff-host">lynx@web</div><div class="ff-rule">─────────</div>';
    rows.forEach(function (r) {
      right += '<div class="ff-row"><span class="ff-key">' + esc(r[0]) +
        '</span><span class="ff-sep">: </span><span class="ff-val">' + esc(r[1]) + '</span></div>';
    });

    return '<div class="ff-layout"><pre class="ff-ascii">' + ascii + '</pre><div class="ff-info">' + right + '</div></div>';
  }

  function cowsay(msg) {
    msg = msg || 'moo';
    const max = 40;
    const words = msg.split(/\s+/);
    const lines = [];
    let cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max) {
        if (cur) lines.push(cur);
        cur = w;
      } else {
        cur = (cur + ' ' + w).trim();
      }
    });
    if (cur) lines.push(cur);
    if (!lines.length) lines.push('moo');
    const width = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    const top = ' ' + '_'.repeat(width + 2);
    const bot = ' ' + '-'.repeat(width + 2);
    let bubble = top + '\n';
    lines.forEach(function (l, i) {
      const pad = l + ' '.repeat(width - l.length);
      let border;
      if (lines.length === 1) border = ['< ', ' >'];
      else if (i === 0) border = ['/ ', ' \\'];
      else if (i === lines.length - 1) border = ['\\ ', ' /'];
      else border = ['| ', ' |'];
      bubble += border[0] + pad + border[1] + '\n';
    });
    bubble += bot + '\n';
    bubble += '        \\   ^__^\n';
    bubble += '         \\  (oo)\\_______\n';
    bubble += '            (__)\\       )\\/\\\n';
    bubble += '                ||----w |\n';
    bubble += '                ||     ||';
    return bubble;
  }

  function resolveSession(name) {
    name = (name || '').toLowerCase().replace(/^\.\//, '').replace(/\/$/, '');
    if (SESSIONS[name]) return name;
    const aliases = {
      home: 'fastfetch',
      info: 'fastfetch',
      neofetch: 'fastfetch',
      me: 'about',
      who: 'about',
      status: 'now',
      focus: 'now',
      work: 'projects',
      games: 'portfolio',
      showreels: 'portfolio',
      setup: 'uses',
      dotfiles: 'uses',
      log: 'journal',
      blog: 'journal',
      experiments: 'lab',
      links: 'bookmarks',
      fortune: 'quotes',
      lore: 'archive',
      wiki: 'archive',
      'alt-history': 'archive',
      term: 'shell',
      tty: 'shell',
      sh: 'shell',
      bash: 'shell',
      index: 'welcome',
      start: 'welcome'
    };
    return aliases[name] || null;
  }


  let quotesLoading = null;
  function loadQuotesPool() {
    if (window.LYNX_QUOTES && window.LYNX_QUOTES.length) {
      return Promise.resolve(window.LYNX_QUOTES);
    }
    if (quotesLoading) return quotesLoading;
    quotesLoading = new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = 'js/quotes-data.js';
      s.onload = function () {
        resolve(window.LYNX_QUOTES || []);
      };
      s.onerror = function () {
        resolve([]);
      };
      document.head.appendChild(s);
    });
    return quotesLoading;
  }

  const commands = {
    help: function (args) {
      if (args[0]) {
        const topic = args[0].toLowerCase();
        const details = {
          help: 'help [command] — list commands or show detail for one',
          clear: 'clear / cls — clear the screen',
          ls: 'ls / sessions — list available sessions',
          open: 'open <session> — navigate to a session (alias: cd, go)',
          cat: 'cat <file> — read a virtual file (readme, about, projects, contact, motd)',
          neofetch: 'neofetch / fastfetch — system information',
          whoami: 'whoami — print the current user',
          date: 'date — print the current date and time',
          uptime: 'uptime — how long Lynx has been online (since 2007-11-02)',
          pwd: 'pwd — print working directory',
          echo: 'echo <text> — print text',
          history: 'history — show command history',
          github: 'github — open GitHub profile in a new tab',
          contact: 'contact — show contact info',
          fortune: 'fortune [random] — daily quote (or random with -r)',
          cowsay: 'cowsay [message] — a cow says something',
          matrix: 'matrix — enter the matrix (briefly)',
          sudo: 'sudo <cmd> — elevated privileges (sort of)',
          lynx: 'lynx — about this identity',
          exit: 'exit — leave the shell (not really)'
        };
        if (details[topic]) print(details[topic]);
        else print('No help entry for: ' + topic, 'shell-err');
        return;
      }
      print('Available commands:\n');
      print('  help [cmd]     Show this list or command detail');
      print('  clear, cls     Clear the terminal');
      print('  ls, sessions   List sessions');
      print('  open, cd, go   Open a session (e.g. open about)');
      print('  cat <file>     Read readme | about | projects | contact | motd');
      print('  neofetch       System information');
      print('  whoami         Current user');
      print('  date, uptime   Time info');
      print('  pwd            Working directory');
      print('  echo <text>    Print text');
      print('  history        Command history');
      print('  github         Open GitHub profile');
      print('  contact        Contact info');
      print('  fortune        Daily quote (fortune random for random)');
      print('  cowsay [msg]   ASCII cow');
      print('  matrix         Visual effect');
      print('  sudo, lynx, exit');
      print('\nTip: Up/Down arrows for history. Tab to complete commands.');
    },

    clear: function () {
      output.innerHTML = '';
    },
    cls: function () { commands.clear(); },

    ls: function () {
      print('sessions/');
      Object.keys(SESSIONS).forEach(function (name) {
        const s = SESSIONS[name];
        const mark = name === 'shell' ? '  .' : '   ';
        print(mark + name.padEnd(12) + s.desc);
      });
      print('\nVirtual files:  ' + Object.keys(FILES).join('  '));
    },
    sessions: function () { commands.ls(); },

    open: function (args) {
      const name = resolveSession(args[0]);
      if (!name) {
        print('open: session not found: ' + (args[0] || '(none)'), 'shell-err');
        print('Try: ls', 'shell-muted');
        return;
      }
      if (name === 'shell') {
        print('Already in shell.');
        return;
      }
      print('Opening session: ' + name + ' …', 'shell-ok');
      setTimeout(function () {
        window.location.href = SESSIONS[name].path;
      }, 280);
    },
    cd: function (args) {
      if (!args[0] || args[0] === '~' || args[0] === '/') {
        print(SESSIONS.shell.path.replace('shell.html', '~'));
        return;
      }
      commands.open(args);
    },
    go: function (args) { commands.open(args); },

    cat: function (args) {
      const file = (args[0] || '').toLowerCase().replace(/^\.\//, '');
      if (!file) {
        print('cat: missing file operand', 'shell-err');
        print('Try: cat readme | about | projects | contact | motd | now | uses', 'shell-muted');
        return;
      }
      if (FILES[file]) print(FILES[file]);
      else print('cat: ' + file + ': No such file', 'shell-err');
    },

    neofetch: function () {
      printHTML(buildNeofetch());
    },
    fastfetch: function () { commands.neofetch(); },

    whoami: function () {
      print('lynx');
    },

    date: function () {
      print(new Date().toString());
    },

    uptime: function () {
      print(formatUptime() + ' (since 2007-11-02 UTC)');
    },

    pwd: function () {
      print('/home/lynx/web/shell');
    },

    echo: function (args) {
      print(args.join(' '));
    },

    history: function () {
      if (!history.length) {
        print('No history yet.');
        return;
      }
      history.forEach(function (cmd, i) {
        print(String(i + 1).padStart(4) + '  ' + cmd);
      });
    },

    github: function () {
      print('Opening https://github.com/theprogrammerofalltime …', 'shell-ok');
      window.open('https://github.com/theprogrammerofalltime', '_blank', 'noopener,noreferrer');
    },

    contact: function () {
      print(FILES.contact);
    },

    fortune: function (args) {
      args = args || [];
      function runWithPool(pool) {
        if (!pool || !pool.length) {
          pool = QUOTES.map(function (s) { return { t: s, a: '' }; });
        }
        const dailyCount = window.LYNX_QUOTES_DAILY_COUNT || 5;

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
          return Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
        }
        function pickDaily(n) {
          var rand = mulberry32(daySeed() ^ 0x9E3779B9);
          var idxs = [];
          for (var i = 0; i < pool.length; i++) idxs.push(i);
          n = Math.min(n, idxs.length);
          for (var i = 0; i < n; i++) {
            var j = i + Math.floor(rand() * (idxs.length - i));
            var tmp = idxs[i]; idxs[i] = idxs[j]; idxs[j] = tmp;
          }
          return idxs.slice(0, n).map(function (ix) { return pool[ix]; });
        }

        if (args[0] === 'random' || args[0] === '-r') {
          var pick = pool[Math.floor(Math.random() * pool.length)];
          if (typeof pick === 'string') print(pick, 'shell-accent');
          else print('"' + pick.t + '" — ' + pick.a, 'shell-accent');
          scrollToBottom();
          return;
        }
        if (args[0] === 'all' || args[0] === 'today') {
          var set = pickDaily(dailyCount);
          print('Quotes for today (' + dailyCount + ' of ' + pool.length + '):', 'shell-muted');
          set.forEach(function (q, i) {
            if (typeof q === 'string') print((i + 1) + '. ' + q, 'shell-accent');
            else print((i + 1) + '. "' + q.t + '" — ' + q.a, 'shell-accent');
          });
          scrollToBottom();
          return;
        }
        var today = pickDaily(dailyCount);
        var one = today[Math.floor(Math.random() * today.length)];
        if (typeof one === 'string') print(one, 'shell-accent');
        else print('"' + one.t + '" — ' + one.a, 'shell-accent');
        print('(fortune today · fortune random · pool: ' + pool.length + ')', 'shell-muted');
        scrollToBottom();
      }

      if (window.LYNX_QUOTES && window.LYNX_QUOTES.length) {
        runWithPool(window.LYNX_QUOTES);
      } else {
        print('Loading quote pool…', 'shell-muted');
        loadQuotesPool().then(function (pool) {
          runWithPool(pool);
          input.focus();
        });
      }
    },
    quote: function () { commands.fortune(); },

    cowsay: function (args) {
      print(cowsay(args.join(' ') || 'lynx@web'));
    },

    matrix: function () {
      print('Wake up, Lynx…', 'shell-ok');
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      let frames = 0;
      const maxFrames = 14;
      const row = line('', 'shell-matrix');
      const id = setInterval(function () {
        let s = '';
        for (let i = 0; i < 56; i++) {
          s += chars[Math.floor(Math.random() * chars.length)];
        }
        row.textContent = s;
        frames += 1;
        if (frames >= maxFrames) {
          clearInterval(id);
          row.textContent = '';
          print('Connection closed. Welcome back to lynx@web.', 'shell-muted');
          scrollToBottom();
          input.focus();
        }
      }, 70);
    },

    sudo: function (args) {
      if (!args.length) {
        print('usage: sudo <command>', 'shell-muted');
        return;
      }
      if (args[0] === 'rm' && args.indexOf('-rf') !== -1) {
        print('sudo: refusing to operate on root filesystem. Nice try.', 'shell-err');
        return;
      }
      print('[sudo] password for lynx: ', 'shell-muted');
      print('Sorry, try again.', 'shell-err');
      print('(This is a static site. You are already root of your own browser.)', 'shell-muted');
    },

    lynx: function () {
      print('lynx — the browser, the animal, and this handle.');
      print('A terminal-shaped corner of the web.');
      print('GitHub: theprogrammerofalltime');
    },

    exit: function () {
      print('There is no exit. Only more sessions.');
      print('Try: open welcome', 'shell-muted');
    },
    logout: function () { commands.exit(); },
    quit: function () { commands.exit(); },

    uname: function (args) {
      if (args[0] === '-a') print('LynxWeb 1.0 lynx-sh x86_64 GNU/Web');
      else print('LynxWeb');
    },

    id: function () {
      print('uid=1000(lynx) gid=1000(lynx) groups=1000(lynx),999(wheel)');
    },

    hostname: function () {
      print('lynx-web');
    }
  };

  // Session name shortcuts: typing "about" alone opens it
  Object.keys(SESSIONS).forEach(function (name) {
    if (!commands[name]) {
      commands[name] = function () {
        commands.open([name]);
      };
    }
  });

  function run(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    line(
      '<span class="prompt">[lynx@web ~]$</span> <span class="shell-cmd">' + esc(trimmed) + '</span>',
      'shell-echo'
    );

    saveHistory(trimmed);

    // very light pipe / chain support: only first command
    const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const tokens = parts.map(function (t) {
      return t.startsWith('"') && t.endsWith('"') ? t.slice(1, -1) : t;
    });
    const cmd = (tokens[0] || '').toLowerCase();
    const args = tokens.slice(1);

    if (commands[cmd]) {
      try {
        commands[cmd](args);
      } catch (err) {
        print('Error: ' + (err && err.message ? err.message : String(err)), 'shell-err');
      }
    } else {
      print('lynx-sh: command not found: ' + cmd, 'shell-err');
      print('Type "help" for a list of commands.', 'shell-muted');
    }
    scrollToBottom();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = input.value;
    input.value = '';
    run(value);
  });

  // History navigation
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || '';
      // move caret to end
      setTimeout(function () {
        input.selectionStart = input.selectionEnd = input.value.length;
      }, 0);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!history.length) return;
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = historyIndex === history.length ? '' : (history[historyIndex] || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cur = input.value.trim().toLowerCase();
      if (!cur) return;
      const names = Object.keys(commands).filter(function (c) {
        return c.startsWith(cur);
      });
      if (names.length === 1) {
        input.value = names[0] + (commands[names[0]].length ? '' : '');
        // if it's a simple command, just complete the name
        input.value = names[0];
      } else if (names.length > 1) {
        print(names.join('  '), 'shell-muted');
        scrollToBottom();
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      commands.clear();
    } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
      // allow default copy; if empty selection, show ^C
      if (!window.getSelection || !String(window.getSelection())) {
        line('<span class="prompt">[lynx@web ~]$</span> <span class="shell-cmd">' + esc(input.value) + '</span>^C', 'shell-echo');
        input.value = '';
        scrollToBottom();
      }
    }
  });

  // Click anywhere in the terminal body to focus input
  const body = document.querySelector('.shell-terminal-body');
  if (body) {
    body.addEventListener('click', function () {
      input.focus();
    });
  }

  // Boot sequence
  function boot() {
    print('lynx-sh 1.0 (web)', 'shell-muted');
    print('Type "help" to get started. Type "ls" to list sessions.\n', 'shell-muted');
    print(FILES.motd, 'shell-accent');
    print('');
    input.focus();
    scrollToBottom();
  }

  // Respect reduced motion: still show text, just skip matrix-style flair later
  boot();
})();
