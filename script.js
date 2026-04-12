const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]';
const G = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function scramble(el, text, ms = 700, cb) {
  let f = 0, total = Math.floor(ms / 35);
  const iv = setInterval(() => {
    el.textContent = text.split('').map((c, i) => {
      if (c === ' ') return ' ';
      return f / total > i / text.length ? c : G();
    }).join('');
    if (++f > total) {el.textContent = text; clearInterval(iv); if (cb) cb();}
  }, 35);
}

function deconstruct(el, text, ms = 600, cb) {
  let f = 0, total = Math.floor(ms / 35);
  const iv = setInterval(() => {
    el.textContent = text.split('').map((c, i) => {
      if (c === ' ') return ' ';
      return f / total < i / text.length ? c : G();
    }).join('');
    if (++f > total) {clearInterval(iv); if (cb) cb();}
  }, 35);
}

function lockWidth(el) {
  if (el.dataset.widthLocked) return;
  el.dataset.widthLocked = '1';
  const w = el.getBoundingClientRect().width;
  el.style.width = w + 'px';
}

function scrambleLoop(el, text, opts = {}) {
  const deMs = opts.deconstructMs || 600;
  const holdMs = opts.holdMs || 700;
  const reMs = opts.reconstructMs || 650;
  const pause = opts.pauseMs || 4000;

  lockWidth(el);

  function cycle() {
    deconstruct(el, text, deMs, () => {
      const holdIv = setInterval(() => {
        el.textContent = text.split('').map(c => c === ' ' ? ' ' : G()).join('');
      }, 55);
    
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setTimeout(() => {

        clearInterval(holdIv);
        scramble(el, text, reMs, () => setTimeout(cycle, pause));
      }, holdMs);
    });
  }
  setTimeout(cycle, pause + Math.random() * 2000);
}

/* ─── TERMINAL ─── */
const termOutput = document.getElementById('term-output');
const termInput = document.getElementById('term-input');
let cmdHistory = [], histIdx = -1;
let currentDir = '~/portfolio';

function termLine(text, cls = 'out') {
  const s = document.createElement('span');
  s.className = 'tl ' + cls;
  s.textContent = text;
  termOutput.appendChild(s);
  termOutput.scrollTop = termOutput.scrollHeight;
}
function termBlank() {termLine('', 'blank');}
function termPromptLine(cmd) {termLine(cmd, 'prompt');}

function typeLineAsync(text, cls = 'out', speed = 22) {
  return new Promise(resolve => {
    const s = document.createElement('span');
    s.className = 'tl ' + cls;
    termOutput.appendChild(s);
    let i = 0;
    const iv = setInterval(() => {
      s.textContent = text.slice(0, ++i);
      termOutput.scrollTop = termOutput.scrollHeight;
      if (i >= text.length) {clearInterval(iv); resolve();}
    }, speed);
  });
}
const wait = ms => new Promise(r => setTimeout(r, ms));

const LINKS = {
  github: 'https://github.com/Nikhil00437',
  linkedin: 'https://www.linkedin.com/in/nikhil-bisht-986047298/',
  hf: 'https://huggingface.co/Nikhil1581',
  instagram: 'https://www.instagram.com/nikhil_.1581',
  email: 'mailto:nikhilbisht2005@gmail.com',
};

const FS = {
  '~/portfolio': ['about.txt', 'skills.json', 'projects/', 'models/', 'resume.pdf', 'README.md', '.gitconfig'],
  '~/portfolio/projects': ['ARIA/', 'RAG-Chatbot/', 'EmotionDetect/', 'PIXEDIT/'],
  '~/portfolio/models': ['qwen3-4b-excel.gguf', 'qwen3.5-2b-excel.gguf', 'excel_dataset.json'],
};

const CMDS = {
  help() {
    termLine('┌─── Available Commands ─────────────────┐', 'info');
    [['help', 'Show this menu'], ['about', 'About Nikhil'], ['skills', 'Technical skills'],
    ['projects', 'Project list'], ['contact', 'Contact info'], ['neofetch', 'System info'],
    ['whoami', 'Identity'], ['date', 'Current date & time'], ['uptime', 'Site uptime'],
    ['ls', 'List files'], ['cd <dir>', 'Change directory'], ['pwd', 'Working directory'],
    ['cat <file>', 'Read a file'], ['open <name>', 'Open a link (github/linkedin/hf)'],
    ['resume', 'Download resume'], ['aria', 'Boot ARIA sequence'], ['clear', 'Clear terminal'],
    ['history', 'Command history'], ['sudo <cmd>', 'Run as root'], ['matrix', 'Enter the matrix'],
    ['coffee', 'Essential fuel'], ['ping', 'Ping the server'], ['theme <l/d>', 'Toggle theme'],
    ['fortune', 'Random wisdom'], ['konami', 'Secret code'], ['hack', 'Hack the mainframe'],
    ['42', 'The answer'], ['easter', 'Find eggs'],
    ].forEach(([c, d]) => termLine(`  ${c.padEnd(16)}${d}`, 'out'));
    termLine('└────────────────────────────────────────┘', 'info');
  },
  about() {
    termLine('┌─ Nikhil ─────────────────────────┐', 'info');
    ['Final-year B.Tech AI & Data Science', 'CGC Landran, Punjab',
      'Specializes in LLM fine-tuning, RAG,', 'computer vision & local AI deployment.',
      'Flagship: ARIA — fully local Windows', 'AI assistant (15 modules).',
    ].forEach(l => termLine('  ' + l, 'out'));
    termLine('  Philosophy: Shipped beats perfect.', 'warn');
    termLine('└────────────────────────────────────────┘', 'info');
  },
  skills() {
    termLine('⚡ Core Skills:', 'info');
    termLine('  Languages   → Python, C/C++, JS, SQL', 'out');
    termLine('  AI/ML       → PyTorch, LLM Fine-tuning, QLoRA', 'out');
    termLine('  Frameworks  → FastAPI, PyQt5, OpenCV', 'out');
    termLine('  Infra       → Docker, MongoDB, LM Studio', 'out');
    termLine('  Models      → GGUF, Ollama, HuggingFace', 'out');
    termLine('  Speciality  → Local AI, RAG, Stable Diffusion', 'warn');
  },
  projects() {
    termLine('📁 Projects:', 'info');
    [['01', 'ARIA', 'LLM Desktop AI — 15 module local assistant'],
    ['02', 'RAG Chatbot', 'Verified-document RAG, no hallucinations'],
    ['03', 'Emotion Detection', 'Real-time DeepFace + OpenCV'],
    ['04', 'PIXEDIT', 'Full image editor — PyQt5 + PIL → .exe'],
    ].forEach(([n, name, desc]) => {
      termLine(`  [${n}] ${name}`, 'ok');
      termLine(`      ${desc}`, 'dim');
    });
    termLine('  → github.com/Nikhil00437', 'info');
  },
  contact() {
    termLine('📬 Contact:', 'info');
    termLine('  Email     nikhilbisht2005@gmail.com', 'out');
    termLine('  Phone     +91 81990 81617', 'out');
    termLine('  GitHub    github.com/Nikhil00437', 'out');
    termLine('  LinkedIn  nikhil-bisht-986047298', 'out');
    termLine('  HF        huggingface.co/Nikhil1581', 'out');
    termLine('  Insta     @nikhil_.1581', 'out');
  },
  whoami() {termLine('nikhil — AI & Data Science Engineer', 'ok');},
  date() {termLine(new Date().toString(), 'out');},
  uptime() {
    const s = Math.floor((Date.now() - window._loadTime) / 1000);
    termLine(`Site uptime: ${Math.floor(s / 60)}m ${s % 60}s`, 'out');
  },
  pwd() {termLine(currentDir, 'out');},
  ls() {
    const files = FS[currentDir];
    if (!files) {termLine('ls: cannot access: No such directory', 'err'); return;}
    termLine(files.join('  '), 'out');
  },
  cd(args) {
    if (!args || args === '~' || args === '~/portfolio') {currentDir = '~/portfolio'; termLine(currentDir, 'dim'); return;}
    if (args === '..') {currentDir = '~/portfolio'; termLine(currentDir, 'dim'); return;}
    const t = currentDir + '/' + args.replace(/\/$/, '');
    if (FS[t]) {currentDir = t; termLine(currentDir, 'dim');}
    else termLine(`cd: ${args}: No such directory`, 'err');
  },
  cat(args) {
    if (!args) {termLine('cat: missing file operand', 'err'); return;}
    const fc = {
      'about.txt': 'Nikhil — Final-year B.Tech AI & DS.\nBuilds production-grade ML systems.\nFlagship: ARIA (local AI assistant).\nShipped beats perfect.',
      'README.md': '# Portfolio\n\nAI & Data Science Engineer portfolio.\nBuilt with vanilla HTML/CSS/JS.\nNo frameworks. No dependencies. Just code.',
      '.gitconfig': '[user]\n  name = Nikhil\n  email = nikhilbisht2005@gmail.com\n[core]\n  editor = vim',
      'skills.json': '{\n  "languages": ["Python","C/C++","JS","SQL"],\n  "ml": ["PyTorch","QLoRA","RAG","CV"],\n  "tools": ["Docker","MongoDB","LM Studio"]\n}',
    };
    if (fc[args]) fc[args].split('\n').forEach(l => termLine(l, 'out'));
    else if (args === 'resume.pdf') termLine('Binary file — use `resume` to download', 'warn');
    else termLine(`cat: ${args}: No such file`, 'err');
  },
  neofetch() {
    termBlank();
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'Light [#f5f5fa]' : 'Dark [#0a0a0f]';
    ['nikhil@portfolio', '─────────────────',
      'OS      Web / HTML5', 'Host    github.com/Nikhil00437',
      'Kernel  Vanilla JS (no frameworks)', 'Shell   Interactive Terminal v1.0',
      `Theme   ${currentTheme}`, 'Stack   Python / PyTorch / LLMs',
      'GPU     QLoRA fine-tuning capable', 'Memory  15 ARIA modules loaded',
      'Uptime  Since 2005 🚀',
    ].forEach((l, i) => termLine('  ' + l, i === 0 ? 'ok' : i === 1 ? 'dim' : 'out'));
    termBlank();
    termLine('  ███████████████████████', 'info');
  },
  clear() {termOutput.innerHTML = '';},
  resume() {
    termLine('⬇ Downloading resume...', 'ok');
    const a = document.createElement('a'); a.href = 'resume/2221394_Nikhil.pdf'; a.download = ''; a.click();
  },
  open(args) {
    if (!args) {termLine('Usage: open <github|linkedin|hf|instagram|email>', 'warn'); return;}
    const key = args.toLowerCase();
    if (LINKS[key]) {window.open(LINKS[key], '_blank'); termLine(`Opening ${key}...`, 'ok');}
    else {termLine(`open: unknown target '${args}'`, 'err'); termLine('Try: github, linkedin, hf, instagram, email', 'dim');}
  },
  echo(args) {termLine(args || '', 'out');},
  history() {
    if (!cmdHistory.length) {termLine('No commands in history', 'dim'); return;}
    cmdHistory.forEach((c, i) => termLine(`  ${(i + 1).toString().padStart(3)}  ${c}`, 'out'));
  },
  sudo() {termLine('[sudo] password for nikhil: ********', 'out'); setTimeout(() => termLine('Nice try. This terminal runs in user space. 😏', 'warn'), 800);},
  rm(args) {if (args && args.includes('-rf')) {termLine("🔥 Permission denied. You can't destroy what's already shipped.", 'err'); termLine('   ...nice try though.', 'dim');} else termLine('rm: missing operand', 'err');},
  matrix() {
    termLine('Wake up, Nikhil...', 'ok');
    setTimeout(() => termLine('The Matrix has you...', 'ok'), 600);
    setTimeout(() => termLine('Follow the white rabbit. 🐇', 'ok'), 1200);
    setTimeout(() => {let l = ''; for (let i = 0; i < 42; i++)l += '01'[Math.floor(Math.random() * 2)]; termLine(l, 'ok');}, 1800);
  },
  coffee() {
    ['    ( (  ', '     ) ) ', '   .____.', "   |    |]", '   \\    / ', "    `--'  "].forEach(l => termLine(l, 'warn'));
    termLine("  Here's your mass ☕", 'dim');
  },
  async aria() {
    termLine('# ARIA v4 — Local AI Assistant', 'dim'); termBlank();
    await typeLineAsync('Initializing LM Studio client...', 'out', 25); await wait(400);
    termLine('✓ Model loaded: qwen3-4b-excel-ft', 'ok'); await wait(300);
    await typeLineAsync('Connecting to MongoDB...', 'out', 25); await wait(350);
    termLine('✓ Database connected', 'ok'); await wait(200);
    await typeLineAsync('Loading 15 modules...', 'out', 25); await wait(500);
    termLine('✓ Voice engine ready', 'ok');
    termLine('✓ Stable Diffusion loaded', 'ok');
    termLine('✓ Self-modification tier: ACTIVE', 'ok'); await wait(300);
    termLine('✓ ARIA v4 ready — all systems operational', 'ok'); termBlank();
    termLine('ARIA › How can I help today?', 'ok');
  },
  ping() {
    termLine('PING nikhil.dev (127.0.0.1): 56 data bytes', 'out');
    [32, 28, 31, 29].forEach((ms, i) => {
      setTimeout(() => {
        termLine(`64 bytes: icmp_seq=${i} ttl=64 time=${ms}.${Math.floor(Math.random() * 9)}ms`, 'out');
        if (i === 3) {termBlank(); termLine('--- 4 packets transmitted, 4 received, 0% loss ---', 'ok');}
      }, (i + 1) * 400);
    });
  },
  theme(args) {
    if (args === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggle) themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'light');
      termLine('Theme: light', 'ok');
    } else if (args === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
      termLine('Theme: dark', 'ok');
    } else termLine('Usage: theme <light|dark>', 'warn');
  },
};

function execCmd(raw) {
  const t = raw.trim(); if (!t) return;
  cmdHistory.push(t); histIdx = cmdHistory.length;
  termPromptLine(t);
  const parts = t.split(/\s+/), cmd = parts[0].toLowerCase(), args = parts.slice(1).join(' ');
  if (cmd === 'rm') {CMDS.rm(args); return;}
  if (CMDS[cmd]) CMDS[cmd](args);
  else {termLine(`command not found: ${cmd}`, 'err'); termLine("Type 'help' for available commands", 'dim');}
}

/* ─── THEME TOGGLE ─── */
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  if (themeToggle) themeToggle.textContent = '☀️';
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeToggle.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    }
  });
}

/* ─── ANIMATED COUNTERS ─── */
function animateCounter(el, target, suffix = '', duration = 1200) {
  const isNumeric = /^\d+$/.test(target);
  if (!isNumeric) { el.textContent = target; return; }
  const num = parseInt(target, 10);
  const start = performance.now();
  el.classList.add('counting');
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * num) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else { el.textContent = num + suffix; setTimeout(() => el.classList.remove('counting'), 300); }
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const counters = e.target.querySelectorAll('.sg-n');
      counters.forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(.*)$/);
        if (match) animateCounter(el, match[1], match[2]);
      });
      counterObs.unobserve(e.target);
    }
  });
}, {threshold: 0.3});
const statGrid = document.querySelector('.stat-grid');
if (statGrid) counterObs.observe(statGrid);

const heroStatsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.hstat-n[data-text]').forEach(el => {
        const text = el.dataset.text;
        const match = text.match(/^(\d+)(.*)$/);
        if (match) animateCounter(el, match[1], match[2]);
        else el.textContent = text;
      });
      heroStatsObs.unobserve(e.target);
    }
  });
}, {threshold: 0.5});
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroStatsObs.observe(heroStats);

/* ─── PROJECT FILTERS ─── */
document.querySelectorAll('.pfilter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pfilter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.pcard').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── COPY TO CLIPBOARD ─── */
document.querySelectorAll('.clink[data-copy]').forEach(clink => {
  clink.addEventListener('click', e => {
    e.preventDefault();
    const text = clink.dataset.copy;
    navigator.clipboard.writeText(text).then(() => {
      const toast = clink.querySelector('.copy-toast');
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1500);
      }
    }).catch(() => {
      if (clink.href) window.location.href = clink.href;
    });
  });
});

/* ─── TERMINAL NEW OUTPUT INDICATOR ─── */
const termNewIndicator = document.getElementById('term-new');
const tBody = document.getElementById('term-output');
let termFocused = true;

if (tBody) {
  tBody.addEventListener('scroll', () => {
    const atBottom = tBody.scrollHeight - tBody.scrollTop - tBody.clientHeight < 30;
    if (atBottom && termNewIndicator) termNewIndicator.classList.remove('show');
  });
}

document.getElementById('term-input')?.addEventListener('focus', () => {
  termFocused = true;
  if (termNewIndicator) termNewIndicator.classList.remove('show');
});
document.getElementById('term-input')?.addEventListener('blur', () => { termFocused = false; });

const origTermLine = termLine;
termLine = function(text, cls) {
  origTermLine(text, cls);
  if (!termFocused && termNewIndicator) {
    termNewIndicator.classList.add('show');
  }
};

/* ─── TERMINAL EASTER EGGS ─── */
const FORTUNES = [
  "The best way to predict the future is to invent it. — Alan Kay",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "Any sufficiently advanced technology is indistinguishable from magic. — Arthur C. Clarke",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Code is like humor. When you have to explain it, it's bad. — Cory House",
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "Make it work, make it right, make it fast. — Kent Beck",
  "The most disastrous thing you can ever learn is your first programming language. — Alan Kay",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. — Bill Gates",
  "There are only two hard things in CS: cache invalidation and naming things. — Phil Karlton",
];

const KONAMI_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

CMDS.fortune = function() {
  const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
  termLine('🔮 ' + f, 'info');
}

CMDS.konami = function() {
  termLine('🎮 Konami code activated!', 'ok');
  termLine('  ↑ ↑ ↓ ↓ ← → ← → B A', 'info');
  termBlank();
  termLine('  +30 lives', 'ok');
  termLine('  Unlocking secret achievement...', 'dim');
  setTimeout(() => termLine('  🏆 Achievement Unlocked: Nostalgic Gamer', 'warn'), 1000);
}

CMDS.easter = function() {
  termLine('🥚 You found the easter egg!', 'ok');
  termLine('  But wait... there are more.', 'dim');
  termLine('  Try: konami, fortune, hack, 42', 'info');
}

CMDS.hack = function() {
  termLine('Initiating hack sequence...', 'err');
  setTimeout(() => termLine('  [████████████████████] 100%', 'ok'), 500);
  setTimeout(() => termLine('  Access granted. Just kidding. 😄', 'warn'), 1200);
}

CMDS['42'] = function() {termLine('The answer to life, the universe, and everything.', 'info');}

termInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {execCmd(termInput.value); termInput.value = '';}
  else if (e.key === 'ArrowUp') {e.preventDefault(); if (histIdx > 0) {histIdx--; termInput.value = cmdHistory[histIdx];} }
  else if (e.key === 'ArrowDown') {e.preventDefault(); if (histIdx < cmdHistory.length - 1) {histIdx++; termInput.value = cmdHistory[histIdx];} else {histIdx = cmdHistory.length; termInput.value = '';} }
  else if (e.key === 'Tab') {e.preventDefault(); const v = termInput.value.toLowerCase(); const m = Object.keys(CMDS).filter(c => c.startsWith(v)); if (m.length === 1) termInput.value = m[0] + ' '; else if (m.length > 1) {termPromptLine(v); termLine(m.join('  '), 'dim');} }
  else if (e.key === 'l' && e.ctrlKey) {e.preventDefault(); CMDS.clear();}
  else {
    if (e.key === KONAMI_CODE[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI_CODE.length) {
        konamiIdx = 0;
        termLine('🎮 Konami code detected!', 'ok');
        CMDS.konami();
      }
    } else {
      konamiIdx = 0;
    }
  }
});
document.getElementById('terminal-card').addEventListener('click', () => termInput.focus());

async function termBoot() {
  await wait(1700);
  termLine('# nikhil@portfolio — interactive shell v1.0', 'dim'); termBlank();
  await typeLineAsync('Initializing portfolio system...', 'out', 30); await wait(300);
  termLine('✓ 4 projects loaded', 'ok'); await wait(200);
  termLine('✓ 3 HF models indexed', 'ok'); await wait(200);
  termLine('✓ Terminal ready', 'ok'); termBlank();
  termLine("Welcome! Type 'help' to see all commands.", 'info');
  termLine('Try: about, projects, neofetch, aria, coffee', 'dim'); termBlank();
  termInput.focus();
}

/* ─── INIT ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');

    document.querySelectorAll('.reveal-inner').forEach(el => {
      setTimeout(() => el.classList.add('show'), parseInt(el.dataset.d || 0));
    });

    setTimeout(() => {
      document.querySelectorAll('.hstat-n[data-text]').forEach(el => {
        scramble(el, el.dataset.text, 900);
      });

      document.querySelectorAll('.scramble-word').forEach(el => {
        lockWidth(el);
      });

      const titleWords = document.querySelectorAll('.scramble-word');
      titleWords.forEach((el, i) => {
        const text = el.dataset.text || el.textContent.trim();
        scrambleLoop(el, text, {
          deconstructMs: 480,
          holdMs: 600,
          reconstructMs: 560,
          pauseMs: 4000 + i * 1200,
        });
      });

      document.querySelectorAll('.hstat-n[data-text]').forEach((el, i) => {
        const text = el.dataset.text;
        scrambleLoop(el, text, {
          deconstructMs: 380,
          holdMs: 450,
          reconstructMs: 420,
          pauseMs: 6000 + i * 900,
        });
      });

    }, 1400);

    termBoot();
  }, 1000);
});

/* ─── SCROLL (native, no RAF hijack) ─── */
function onScroll() {
  const s = window.scrollY;
  const pct = s / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('progress').style.width = pct + '%';
  document.getElementById('nav').classList.toggle('scrolled', s > 60);

  const secs = [...document.querySelectorAll('section[id]')];
  let cur = null;
  for (const sec of secs) {
    if (s + window.innerHeight * 0.4 >= sec.getBoundingClientRect().top + s) cur = sec.id;
  }
  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.getAttribute('href') === '#' + cur)
  );

  /* Back to top */
  const btt = document.getElementById('back-to-top');
  if (btt) btt.classList.toggle('visible', s > 600);
}
window.addEventListener('scroll', onScroll, {passive: true});

/* Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {e.preventDefault(); el.scrollIntoView({behavior: 'smooth', block: 'start'});}
  });
});

/* ─── HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── CURSOR ─── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
  let cmx = 0, cmy = 0, crx = 0, cry = 0;
  document.addEventListener('mousemove', e => {cmx = e.clientX; cmy = e.clientY;});
  (function curLoop() {
    crx += (cmx - crx) * 0.12; cry += (cmy - cry) * 0.12;
    dot.style.left = cmx + 'px'; dot.style.top = cmy + 'px';
    ring.style.left = crx + 'px'; ring.style.top = cry + 'px';
    requestAnimationFrame(curLoop);
  })();
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('on-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('on-link'));
  });
  document.querySelectorAll('.btn, .mag-btn').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('on-btn'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('on-btn'));
  });
}

/* ─── MAGNETIC BUTTONS ─── */
document.querySelectorAll('.mag-btn, .btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    btn.style.transform = `translate(${dx * .3}px, ${dy * .3}px)`;
    const inner = btn.querySelector('.mag-inner');
    if (inner) inner.style.transform = `translate(${dx * .15}px, ${dy * .15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    const inner = btn.querySelector('.mag-inner');
    if (inner) inner.style.transform = '';
  });
});

/* ─── TILT CARDS ─── */
document.querySelectorAll('.tilt-card').forEach(card => {
  let tgtX = 0, tgtY = 0, curX = 0, curY = 0, curS = 1;
  let hovering = false, raf = null;
  const LERP_IN = 0.18, LERP_OUT = 0.08;

  function loop() {
    const lerp = hovering ? LERP_IN : LERP_OUT;
    const tgtS = hovering ? 1.02 : 1;
    curX += (tgtX - curX) * lerp;
    curY += (tgtY - curY) * lerp;
    curS += (tgtS - curS) * lerp;

    card.style.transform =
      `perspective(900px) rotateX(${curX.toFixed(3)}deg) rotateY(${curY.toFixed(3)}deg) scale(${curS.toFixed(4)})`;

    const settled = Math.abs(tgtX - curX) < 0.01
      && Math.abs(tgtY - curY) < 0.01
      && Math.abs(tgtS - curS) < 0.001;

    if (!settled || hovering) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }

  function startLoop() {
    if (!raf) raf = requestAnimationFrame(loop);
  }

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;

    tgtY = ((x - cx) / cx) * 8;
    tgtX = -((y - cy) / cy) * 8;

    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');

    if (!hovering) {
      hovering = true;
      startLoop();
    }
  });

  card.addEventListener('mouseleave', () => {
    hovering = false;
    tgtX = 0;
    tgtY = 0;
    startLoop();
  });
});

/* ─── GLOW FOLLOW ─── */
document.querySelectorAll('.sg, .sk-pill, .clink').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ─── SCRAMBLE SECTION TITLES ─── */
const scObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const t = e.target.querySelector('.sec-title');
      if (t) scramble(t, t.textContent.trim(), 700);
    }
  });
}, {threshold: 0.3});
document.querySelectorAll('.sec').forEach(s => scObs.observe(s));

/* ─── REVEAL ON SCROLL ─── */
const rObs = new IntersectionObserver(entries => {
  entries.forEach(e => {if (e.isIntersecting) {e.target.classList.add('vis'); rObs.unobserve(e.target);} });
}, {threshold: 0.1});
document.querySelectorAll('.r').forEach(el => rObs.observe(el));

/* ─── BG TRANSITIONS ─── */
const bgMap = {hero: 'var(--bg-main)', about: 'rgb(12,12,20)', skills: 'var(--bg-main)', projects: 'rgb(10,10,18)', models: 'var(--bg-main)', contact: 'rgb(14,10,22)'};
const bgObs = new IntersectionObserver(entries => {
  entries.forEach(e => {if (e.isIntersecting && bgMap[e.target.id]) document.body.style.backgroundColor = bgMap[e.target.id];});
}, {threshold: 0.4});
document.querySelectorAll('section[id]').forEach(s => bgObs.observe(s));

/* ─── BACK TO TOP ─── */
const bttBtn = document.getElementById('back-to-top');
if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}
