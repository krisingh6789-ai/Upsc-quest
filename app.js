/* ============================================================================
 * LBSNAA QUEST — CORE GAMIFIED RPG APPLICATION
 * Full-stack gamified UPSC study RPG + interactive web bookshelf + infinite
 * quiz dungeon + internet book-grabber (Open Library / Internet Archive).
 * Self-contained vanilla ES6+ with Tailwind (CDN) + FontAwesome.
 * ============================================================================ */

(function () {
  'use strict';

  const DATA = window.UPSC_RPG_DATA || {};
  const STORAGE_KEY = 'lbsnaa_quest_v1';
  const XP_PER_MINUTE = 10;
  const XP_PER_PAGE = 5;

  /* =========================================================================
   * STATE & PERSISTENCE
   * ========================================================================= */
  const DEFAULTS = {
    version: 1,
    avatarId: 'cyber-scribe',
    xp: 0,
    level: 1,
    bookshelf: [],
    quests: [],
    streak: 0,
    badgesUnlocked: [],
    mistakes: [],
    settings: { sfx: true, crt: false, theme: 'dark' },
    savedNotes: [], // {bookId, page, text, at}
    bookTexts: [],  // {sourceId, title, text}
    timerXpAccrued: 0,
    subjectXP: {},          // {subject: xp}
    mainsAnswers: [],       // {id, prompt, answer, gsPaper, words, at, score}
    flashcards: [],         // {id, q, a, subject, interval, repeat, ease, due, lastReview}
    highlights: [],         // {bookId, page, text, note, at}
    prelimsDate: '2026-05-24', // next UPSC Prelims (approx)
    goals: { books: 2, quiz: 50, mains: 2 },
    goalsProgress: {},      // {weekKey: {books, quiz, mains}}
    ttsSpeed: 1,
    ttsHighlight: true
  };

  function cloneDeep(o) { return JSON.parse(JSON.stringify(o)); }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneDeep(DEFAULTS);
      const parsed = JSON.parse(raw);
      const s = { ...DEFAULTS, ...parsed };
      s.settings = { ...DEFAULTS.settings, ...(parsed.settings || {}) };
      return s;
    } catch (e) {
      console.warn('Save load failed', e);
      return cloneDeep(DEFAULTS);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Save failed', e);
      showToast('WARNING: LocalStorage full — progress may not persist!', 'error');
    }
  }

  let state = loadState();

  /* =========================================================================
   * LEVELING ENGINE
   * ========================================================================= */
  function xpToReachLevel(lvl) {
    if (lvl <= 1) return 0;
    return Math.floor(75 * lvl * (lvl - 1)) + 50 * (lvl - 1); // 200, 550, 1050…
  }

  function levelForXP(xp) {
    let lvl = 1;
    while (xp >= xpToReachLevel(lvl + 1)) lvl++;
    return lvl;
  }

  function rankForLevel(lvl) {
    let rank = DATA.RANKS[0];
    for (const r of DATA.RANKS) if (lvl >= r.minLevel) rank = r;
    return rank;
  }

  function addXP(amount, source = 'Study', subject = null) {
    state.xp += amount;
    if (subject) {
      state.subjectXP = state.subjectXP || {};
      state.subjectXP[subject] = (state.subjectXP[subject] || 0) + amount;
    }
    const before = state.level;
    state.level = levelForXP(state.xp);
    saveState();
    renderHUD();
    if (state.level > before) {
      triggerLevelUp(before, state.level);
      if (announce) announce.textContent = `Level up! You are now Level ${state.level}.`;
    }
    if (announce && source) announce.textContent = `+${amount} XP — ${source}`;
    showToast(`+${amount} XP${source ? ` — ${source}` : ''}`, 'xp');
    return state.level > before;
  }

  function triggerLevelUp(oldLvl, newLvl) {
    const el = document.getElementById('levelup-flash-overlay');
    if (el) {
      el.classList.remove('hidden');
      el.classList.add('levelup-flash');
      setTimeout(() => el.classList.add('hidden'), 900);
    }
    playSfx('levelup');
    spawnConfetti(140);
    setTimeout(() => {
      showToast(`LEVEL UP! You are now Level ${newLvl} — ${rankForLevel(newLvl).title}!`, 'success');
    }, 300);
  }

  /* =========================================================================
   * AUDIO (Web Audio API — synthesized 8-bit arcade SFX, no external files)
   * ========================================================================= */
  let audioCtx = null;
  const SFX_ENABLED_KEY = 'sfx';
  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    return audioCtx;
  }

  function playSfx(kind) {
    if (!state.settings.sfx) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = t;

    const cfg = {
      click:  { freq: 880, type: 'square', dur: 0.06, env: [0.02, 0.04] },
      page:   { freq: 660, type: 'triangle', dur: 0.05, env: [0.01, 0.05] },
      correct:{ freq: [523, 659, 784], type: 'square', dur: 0.25, env: [0.05, 0.2] },
      wrong:  { freq: 110, type: 'sawtooth', dur: 0.3, env: [0.02, 0.28] },
      slash:  { freq: 1500, type: 'square', dur: 0.12, env: [0.01, 0.11] },
      levelup:{ freq: [523, 659, 784, 1046], type: 'square', dur: 0.6, env: [0.05, 0.55] },
      badge:  { freq: [880, 1108, 1318], type: 'sine', dur: 0.4, env: [0.05, 0.35] },
      fanfare:{ freq: [261, 329, 392, 523, 659], type: 'square', dur: 0.9, env: [0.05, 0.85] }
    }[kind] || { freq: 440, type: 'square', dur: 0.1, env: [0.02, 0.08] };

    const vol = 0.12;
    if (Array.isArray(cfg.freq)) {
      cfg.freq.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = cfg.type; o.frequency.setValueAtTime(f, now + i * 0.07);
        g.gain.setValueAtTime(0, now + i * 0.07);
        g.gain.linearRampToValueAtTime(vol, now + i * 0.07 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + cfg.dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.07); o.stop(now + i * 0.07 + cfg.dur);
      });
      return;
    }
    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.freq, now);
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + cfg.dur);
    osc.start(now); osc.stop(now + cfg.dur);
  }

  /* =========================================================================
   * VISUAL FX: CONFETTI, SCREEN SHAKE, FLOATING XP, TOASTS
   * ========================================================================= */
  const confCanvas = document.getElementById('particle-canvas');
  let cw = 0, ch = 0, ctx2d = null, particles = [];
  function resizeConf() {
    if (!confCanvas) return;
    cw = confCanvas.width = window.innerWidth;
    ch = confCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConf);
  resizeConf();

  function spawnConfetti(count = 60) {
    if (!confCanvas || !ctx2d) {
      ctx2d = confCanvas.getContext('2d');
    }
    const colors = ['#00f5d4', '#b5179e', '#ffd166', '#f72585', '#10b981', '#38bdf8'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: cw / 2 + (Math.random() - 0.5) * 300,
        y: ch / 2 + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 6,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.025,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 20
      });
    }
    if (!confAnimating) { confAnimating = true; tickConfetti(); }
  }
  let confAnimating = false;
  function tickConfetti() {
    if (!ctx2d) return;
    ctx2d.clearRect(0, 0, cw, ch);
    let alive = 0;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.life -= p.decay;
      p.rot += p.vrot;
      if (p.life > 0) {
        alive++;
        ctx2d.save();
        ctx2d.translate(p.x, p.y);
        ctx2d.rotate((p.rot * Math.PI) / 180);
        ctx2d.fillStyle = p.color;
        ctx2d.globalAlpha = p.life;
        ctx2d.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx2d.restore();
      } else {
        particles.splice(i, 1);
      }
    }
    if (alive > 0) requestAnimationFrame(tickConfetti);
    else confAnimating = false;
  }

  function screenShake() {
    const root = document.getElementById('app-root');
    if (!root) return;
    root.classList.add('screen-shake');
    setTimeout(() => root.classList.remove('screen-shake'), 420);
  }

  function showFloatingXP(x, y, amount) {
    const el = document.createElement('div');
    el.className = 'floating-xp';
    el.textContent = `+${amount} XP`;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  const toastContainer = document.getElementById('toast-container');
  let toastId = 0;

  function showToast(msg, type = 'info', duration = 3000) {
    if (!toastContainer) return;
    const id = ++toastId;
    const el = document.createElement('div');
    const conf = {
      info:  { icon: 'fa-info-circle', color: 'text-cyan-400' },
      success: { icon: 'fa-check-circle', color: 'text-emerald-400' },
      error: { icon: 'fa-triangle-exclamation', color: 'text-rose-400' },
      xp: { icon: 'fa-bolt', color: 'text-amber-400' }
    }[type] || conf.info;
    el.className = 'toast ' + type + ' group';
    el.id = 'toast-' + id;
    el.innerHTML = '<i class="fa-solid ' + conf.icon + ' ' + conf.color + '"></i><span>' + escapeHtml(msg) + '</span><button class="ml-auto p-1 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition" aria-label="Dismiss" data-toast-id="" + id + """ ><i class="fa-solid fa-xmark text-xs"></i></button>';
    toastContainer.appendChild(el);
    el.querySelector('button').addEventListener('click', () => el.remove());
    requestAnimationFrame(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(120%) scale(0.95)';
      el.style.transition = 'none';
      requestAnimationFrame(() => {
        el.style.transition = 'all 0.35s var(--ease-out)';
        el.style.opacity = '1';
        el.style.transform = 'translateX(0) scale(1)';
      });
    });
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(120%) scale(0.95)';
      setTimeout(() => el.remove(), 350);
    }, duration);
  }

  /* =========================================================================
   * HUD
   * ========================================================================= */
  function renderHUD() {
    const announce = document.getElementById('sr-announce');
    const lvlEl = document.getElementById('hud-level-badge');
    const rankEl = document.getElementById('hud-rank-title');
    const xpFill = document.getElementById('hud-xp-fill');
    const xpText = document.getElementById('hud-xp-text');
    const manaText = document.getElementById('hud-mana-text');
    const booksCount = document.getElementById('hud-books-count');
    const streakCount = document.getElementById('hud-streak-count');
    const badgesCount = document.getElementById('hud-badges-count');
    const avatarIcon = document.getElementById('hud-avatar-icon');
    const avatarBtn = document.getElementById('hud-avatar-btn');

    const avatar = DATA.AVATARS.find(a => a.id === state.avatarId) || DATA.AVATARS[0];
    if (avatarIcon) avatarIcon.className = `fa-solid ${avatar.icon} text-2xl ${avatar.color === '#00f5d4' ? 'text-cyan-300' : avatar.color === '#ffd166' ? 'text-amber-300' : avatar.color === '#b5179e' ? 'text-fuchsia-300' : avatar.color === '#f72585' ? 'text-pink-400' : avatar.color === '#10b981' ? 'text-emerald-400' : 'text-orange-400'}`;
    if (avatarBtn) avatarBtn.title = `Switch avatar: ${avatar.name}`;
    if (lvlEl) lvlEl.textContent = `LV.${state.level}`;
    if (rankEl) rankEl.textContent = rankForLevel(state.level).title;

    const curLvlStart = xpToReachLevel(state.level);
    const nextLvlStart = xpToReachLevel(state.level + 1);
    const progress = nextLvlStart > curLvlStart ? (state.xp - curLvlStart) / (nextLvlStart - curLvlStart) : 1;
    if (xpFill) xpFill.style.width = `${Math.min(100, progress * 100)}%`;
    if (xpText) xpText.textContent = `${state.xp} / ${nextLvlStart} XP`;
    if (manaText) manaText.textContent = `${Math.round(state.mana || 100)}%`;
    if (booksCount) booksCount.textContent = `${state.bookshelf.length} Books`;
    if (streakCount) streakCount.textContent = `${state.streak}x`;
    if (badgesCount) badgesCount.textContent = `${state.badgesUnlocked.length} / ${DATA.BADGES.length}`;
  }

  /* =========================================================================
   * FOCUS TIMER STATION (POMODORO)
   * ========================================================================= */
  let timerInterval = null;
  let timerState = {
    minutes: 25,
    timeLeft: 25 * 60,
    running: false
  };

  function fmtTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function updateTimerUI() {
    const pill = document.getElementById('timer-status-pill');
    const ring = document.getElementById('mana-ring-progress');
    const disp = document.getElementById('timer-display');
    const label = document.getElementById('timer-mode-label');
    const card = document.getElementById('mana-station-card');
    const startBtn = document.getElementById('btn-timer-start');

    if (pill) pill.textContent = timerState.running ? 'CHANNELING MANA…' : 'STANDBY';
    if (ring) {
      const total = timerState.minutes * 60;
      const pct = total > 0 ? timerState.timeLeft / total : 1;
      const dash = 477.52;
      ring.style.strokeDashoffset = dash * (1 - pct);
      if (timerState.running) card.classList.add('mana-station-active');
      else card.classList.remove('mana-station-active');
    }
    if (disp) disp.textContent = fmtTime(timerState.timeLeft);
    if (label) label.textContent = timerState.running ? 'MANA CHANNELING' : 'POMODORO FOCUS';
    if (startBtn) startBtn.innerHTML = timerState.running
      ? `<i class="fa-solid fa-pause"></i> Pause Session`
      : `<i class="fa-solid fa-play"></i> Start Focus`;
  }

  function setTimerMinutes(mins) {
    if (timerState.running) return;
    timerState.minutes = mins;
    timerState.timeLeft = mins * 60;
    updateTimerUI();
  }

  function toggleTimer() {
    if (timerState.running) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerState.running = false;
    } else {
      timerState.running = true;
      timerInterval = setInterval(() => {
        timerState.timeLeft--;
        timerState.timerXpAccrued = (state.timerXpAccrued || 0) + 1;
        if (timerState.timerXpAccrued >= 60) {
          timerState.timerXpAccrued -= 60;
          addXP(XP_PER_MINUTE, 'Mana Recharge');
          showToast('Mana crystal recharged +10 XP', 'xp');
        }
        updateTimerUI();
        saveState();
        if (timerState.timeLeft <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          timerState.running = false;
          timerState.timeLeft = 0;
          completeManaSession();
        }
      }, 1000);
    }
    updateTimerUI();
    saveState();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerState.running = false;
    timerState.timeLeft = timerState.minutes * 60;
    updateTimerUI();
    saveState();
  }

  function completeManaSession() {
    playSfx('fanfare');
    spawnConfetti(100);
    addXP(XP_PER_MINUTE * timerState.minutes, 'Full Mana Recharge');
    const bonus = Math.floor(Math.random() * 3) + 1;
    addXP(bonus * 10, 'Concentration Bonus');
    state.mana = 100;
    unlockRandomBadge();
    showToast('Mana FULLY RECHARGED — Relic Badge unlocked!', 'success');
    updateTimerUI();
    renderHUD();
    saveState();
  }

  function unlockRandomBadge() {
    const locked = DATA.BADGES.filter(b => !state.badgesUnlocked.includes(b.id));
    if (!locked.length) return;
    const b = locked[Math.floor(Math.random() * locked.length)];
    state.badgesUnlocked.push(b.id);
    saveState();
    renderBadgesVault();
    renderHUD();
    playSfx('badge');
    showToast(`NEW RELIC UNLOCKED: ${b.name} — ${b.desc}`, 'success');
    spawnConfetti(40);
  }

  /* =========================================================================
   * BOOKSHELF ENGINE (2.5D retro-arcade shelves)
   * ========================================================================= */
  function spineColorFor(book) {
    return book.spineColor || ['#0f4c81', '#78350f', '#1e3a8a', '#9a3412', '#991b1b', '#6b21a8', '#3730a3', '#065f46', '#a16207', '#831843'][Math.floor(Math.random() * 10)];
  }

  function renderBookshelf(filter = 'ALL') {
    const container = document.getElementById('bookshelf-container');
    if (!container) return;
    container.innerHTML = '';

    let books = state.bookshelf.slice();
    if (filter !== 'ALL') books = books.filter(b => b.subject === filter);

    // Sort: equipped books by recency? Keep insertion order.
    const row = document.createElement('div');
    row.className = 'shelf-books-row';

    // Calculate slot geometry
    const slotW = 62;
    const slotH = 150;
    const maxSlots = 10;

    // Render books first
    books.forEach(book => {
      const pages = book.pages || 200;
      const w = Math.max(44, Math.min(96, 44 + pages / 7));
      const h = Math.max(128, Math.min(252, 128 + pages / 6));

      const el = document.createElement('div');
      el.className = 'book-spine';
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.background = `linear-gradient(180deg, ${book.spineColor || '#3b2314'} 0%, rgba(0,0,0,0.35) 100%)`;
      el.style.borderLeft = `4px solid ${book.accentColor || '#00f5d4'}`;
      el.title = `${book.title} — ${book.author} (${pages} pages)`;

      el.innerHTML = `
        <div class="book-foil-band"></div>
        <div class="book-spine-title">${escapeHtml(book.title)}<span style="font-size:9px; opacity:0.85"> • ${escapeHtml(book.author)}</span></div>
      `;

      el.addEventListener('mouseenter', () => showInspector(book));
      el.addEventListener('mouseleave', hideInspector);
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openReader(book);
      });

      // Page progress mini bar
      if (book.progress > 0) {
        const prog = document.createElement('div');
        prog.className = 'absolute bottom-1 left-1 right-1 h-1 bg-slate-900 rounded overflow-hidden border border-slate-600';
        const fill = document.createElement('div');
        fill.className = 'h-full bg-amber-400';
        fill.style.width = `${Math.min(100, book.progress)}%`;
        prog.appendChild(fill);
        el.appendChild(prog);
      }

      row.appendChild(el);
    });

    // Fill remaining with empty slots
    const emptyCount = Math.max(0, maxSlots - books.length);
    for (let i = 0; i < emptyCount; i++) {
      const slot = document.createElement('div');
      slot.className = 'empty-shelf-slot';
      slot.innerHTML = `<i class="fa-solid fa-plus text-xs mb-1"></i><span>EQUIP</span>`;
      slot.addEventListener('click', () => {
        showToast('Open the Book-Grabber or Vault to equip a tome!', 'info');
        showTab('grabber');
      });
      row.appendChild(slot);
    }

    // Under-plank ledges per visible segment
    const plank = document.createElement('div');
    plank.className = 'shelf-plank';
    const label = document.createElement('div');
    label.className = 'shelf-plank-label';
    label.textContent = `SHELF • ${books.length} EQUIPPED`;
    plank.appendChild(label);

    const tier = document.createElement('div');
    tier.className = 'shelf-tier';
    tier.appendChild(row);
    container.appendChild(tier);
    container.appendChild(plank);
  }

  function showInspector(book) {
    const box = document.getElementById('shelf-inspector');
    const text = document.getElementById('inspector-text');
    const meta = document.getElementById('inspector-meta');
    if (!box) return;
    box.classList.remove('hidden');
    if (text) text.textContent = `${book.title} by ${book.author} — ${book.pages} pages • ${book.subject} • ${book.gsPaper || ''} • ${book.rarity}`;
    if (meta) meta.textContent = `SYLLABUS: ${book.syllabus ? book.syllabus.slice(0, 60) + '…' : 'UPSC Core'}`;
  }

  function hideInspector() {
    const box = document.getElementById('shelf-inspector');
    if (box) box.classList.add('hidden');
  }

  function addToShelf(book) {
    const exists = state.bookshelf.some(b => b.id === book.id || (book.iaId && b.iaId === book.iaId));
    if (exists) {
      showToast(`${book.title} is already equipped on your shelf!`, 'info');
      return;
    }
    const item = {
      id: book.id || `ol-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: book.title,
      author: book.author || 'Unknown',
      pages: book.pages || 0,
      subject: book.subject || 'Misc',
      gsPaper: book.gsPaper || '',
      iaId: book.iaId || null,
      olKey: book.olKey || null,
      spineColor: book.spineColor || spineColorFor(book),
      accentColor: book.accentColor || '#00f5d4',
      rarity: book.rarity || 'Common',
      syllabus: book.syllabus || '',
      progress: 0,
      bookmarkedPage: 1,
      addedAt: Date.now()
    };
    state.bookshelf.push(item);
    saveState();
    renderBookshelf(currentShelfFilter);
    renderHUD();
    playSfx('click');
    showToast(`Equipped: ${book.title}`, 'success');
    spawnConfetti(25);
  }

  function equipStarterPack() {
    const starters = DATA.UPSC_BOOK_VAULT.filter(b => b.starter);
    let added = 0;
    starters.forEach(b => {
      if (!state.bookshelf.some(x => x.id === b.id)) {
        state.bookshelf.push(vaultBookToShelf(b));
        added++;
      }
    });
    saveState();
    renderBookshelf(currentShelfFilter);
    renderHUD();
    showToast(`Starter Pack equipped — ${added} new tomes on the shelf!`, 'success');
    spawnConfetti(50);
  }

  function equipAllVault() {
    let added = 0;
    DATA.UPSC_BOOK_VAULT.forEach(b => {
      if (!state.bookshelf.some(x => x.id === b.id)) {
        state.bookshelf.push(vaultBookToShelf(b));
        added++;
      }
    });
    saveState();
    renderBookshelf(currentShelfFilter);
    renderHUD();
    showToast(`Complete UPSC Vault equipped — +${added} tomes!`, 'success');
    spawnConfetti(80);
  }

  function vaultBookToShelf(b) {
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      pages: b.pages,
      subject: b.subject,
      gsPaper: b.gsPaper,
      iaId: b.iaId,
      olKey: b.olKey,
      spineColor: b.spineColor,
      accentColor: b.accentColor,
      rarity: b.rarity,
      syllabus: b.syllabus,
      progress: 0,
      bookmarkedPage: 1,
      addedAt: Date.now()
    };
  }

  let currentShelfFilter = 'ALL';
  let currentVaultCat = 'ALL';
  let currentVaultSearch = '';

  /* =========================================================================
   * INTERNET BOOK-GRABBER (Open Library + Internet Archive full text)
   * ========================================================================= */
  function fetchJson(url, ms = 12000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { signal: ctrl.signal, headers: { 'Origin': 'https://example.com', 'Accept': 'application/json' } })
      .then(res => { clearTimeout(t); if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); });
  }

  function archiveFullTextUrl(iaId) {
    return `https://archive.org/metadata/${encodeURIComponent(iaId)}`;
  }

  function renderOlStatus(msg, type = 'info') {
    const el = document.getElementById('ol-search-status');
    if (!el) return;
    el.classList.remove('hidden');
    const conf = {
      info: 'text-cyan-300 border border-cyan-500/30 bg-cyan-950/40',
      error: 'text-rose-300 border border-rose-500/30 bg-rose-950/40',
      success: 'text-emerald-300 border border-emerald-500/30 bg-emerald-950/40'
    }[type] || conf.info;
    el.className = 'arcade-card p-3 rounded-lg border text-xs sm:text-sm ' + conf;
    el.textContent = msg;
  }

  function renderOlResults(results) {
    const grid = document.getElementById('ol-results-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!results.length) {
      grid.innerHTML = `<div class="col-span-full text-center py-10 arcade-card p-6">
        <i class="fa-solid fa-book-open text-4xl text-slate-700 mb-3 block"></i>
        <div class="text-slate-400 text-xs sm:text-sm">No matches in the global archives. Try another title, author, or topic.</div>
      </div>`;
      return;
    }
    results.forEach(r => {
      const card = document.createElement('div');
      card.className = 'arcade-card p-3 flex flex-col h-full group';
      const coverUrl = r.cover_i ? `https://covers.openlibrary.org/b/id/${r.cover_i}-M.jpg` : 'https://covers.openlibrary.org/b/id/0-M.jpg';
      const hasFullText = r.hasFullText === true;
      const accessLabel = r.ebookAccess === 'borrowable' ? 'Digital Lending' : (r.ebookAccess === 'no_ebook' ? 'Metadata Only' : 'Public Domain');
      const accessBadge = hasFullText
        ? `<span class="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 font-semibold">FULL TEXT</span>`
        : `<span class="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-400 font-semibold">NO FULL TEXT</span>`;
      card.innerHTML = `
        <div class="relative h-24 mb-2.5 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
          <img src="${escapeHtml(coverUrl)}" alt="cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://covers.openlibrary.org/b/id/0-M.jpg'">
          <div class="absolute top-1 right-1 ${accessBadge}"></div>
        </div>
        <div class="flex-1">
          <div class="font-bold text-sm sm:text-base text-slate-100 leading-snug mb-1">${escapeHtml(r.title)}</div>
          <div class="text-xs text-cyan-300 mb-0.5">${escapeHtml(r.authorName ? r.authorName.join(', ') : 'Unknown Author')}</div>
          <div class="flex items-center gap-2 text-[10px] text-slate-500 mb-2.5">
            <span>${r.firstPublishYear || '?'}</span>
            <span>•</span>
            <span>${r.pages ? r.pages + ' pp' : '? pp'}</span>
            <span>•</span>
            <span>${accessLabel}</span>
          </div>
        </div>
        <button class="arcade-btn px-3 py-1.5 text-xs mt-auto ${hasFullText ? 'arcade-btn-gold' : 'arcade-btn'} w-full" data-add="${escapeHtml(JSON.stringify(r))}">
          <i class="fa-solid ${hasFullText ? 'fa-book-open-reader' : 'fa-link'}"></i> ${hasFullText ? 'Add to Shelf' : 'Link Only'}
        </button>
      `;
      card.querySelector('button[data-add]').addEventListener('click', () => {
        const data = JSON.parse(unescapeHtml(card.querySelector('button[data-add]').dataset.add));
        addOlBookToShelf(data);
      });
      grid.appendChild(card);
    });
  }

  function unescapeHtml(s) {
    const d = document.createElement('textarea');
    d.innerHTML = s;
    return d.value;
  }

  async function searchOpenLibrary(query) {
    renderOlStatus('Scanning Open Library archives…', 'info');
    const grid = document.getElementById('ol-results-grid');
    grid.innerHTML = '';
    try {
      const data = await fetchJson(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,cover_i,number_of_pages_median,ia,ebook_access,first_publish_year,edition_count&limit=12`);
      const docs = data.docs || [];
      // Enrich with Archive.org full-text availability
      const enriched = await Promise.all(docs.map(async (doc) => {
        const r = {
          title: doc.title,
          authorName: doc.author_name || [],
          cover_i: doc.cover_i,
          pages: doc.number_of_pages_median || 0,
          firstPublishYear: doc.first_publish_year,
          ebookAccess: doc.ebook_access,
          olKey: doc.key,
          hasFullText: false,
          iaId: null
        };
        if (doc.ia && doc.ia.length) {
          try {
            const meta = await fetchJson(`https://archive.org/metadata/${encodeURIComponent(doc.ia[0])}`, 6000);
            const files = meta.files || [];
            const hasTxt = files.some(f => f.name && f.name.endsWith('_djvu.txt'));
            if (hasTxt) {
              r.hasFullText = true;
              r.iaId = doc.ia[0];
            }
          } catch (e) { /* ignore */ }
        }
        return r;
      }));
      renderOlStatus(`${enriched.length} titles archived. Full-text scans marked for direct reading.`, 'success');
      renderOlResults(enriched);
    } catch (err) {
      renderOlStatus('Connection Error: Try Again — global archive unreachable.', 'error');
      console.error(err);
    }
  }

  function addOlBookToShelf(r) {
    const subject = guessSubject(r.title, r.authorName.join(' '));
    const book = {
      id: `ol-${r.olKey || r.iaId || Date.now()}`,
      title: r.title,
      author: (r.authorName && r.authorName.join(', ')) || 'Unknown Author',
      pages: r.pages || 0,
      subject,
      gsPaper: 'Misc',
      iaId: r.iaId || null,
      olKey: r.olKey || null,
      spineColor: spineColorFor({}),
      accentColor: r.hasFullText ? '#10b981' : '#94a3b8',
      rarity: r.hasFullText ? 'Epic' : 'Common',
      syllabus: `Internet Archive pull — ${subject}`,
      progress: 0,
      bookmarkedPage: 1,
      addedAt: Date.now()
    };
    addToShelf(book);
  }

  function guessSubject(title, author) {
    const t = (title + ' ' + author).toLowerCase();
    const map = [
      ['polity', ['constitution', 'polity', 'laxmikanth', 'basu', 'amendment', 'fundamental rights', 'president', 'parliament']],
      ['history', ['history', 'modern india', 'ancient', 'medieval', 'chandra', 'sharma', 'freedom', 'gandhi', 'nehru', 'independence']],
      ['geography', ['geography', 'physical', 'leong', 'climate', 'oceans', 'landforms']],
      ['economy', ['economy', 'economic', 'india economy', 'dutt', 'macroeconomics']],
      ['environment', ['environment', 'ecology', 'bharucha', 'biodiversity', 'climate change']],
      ['art & culture', ['indian art', 'culture', 'basham', 'coomaraswamy', 'architecture']],
      ['science & tech', ['science', 'biology', 'physics', 'chemistry', 'biotechnology']],
      ['ethics', ['ethics', 'governance', 'philosophy', 'psychology', 'administrative']]
    ];
    for (const [sub, kws] of map) if (kws.some(k => t.includes(k))) return sub;
    return 'Misc';
  }

  /* =========================================================================
   * UPSC VAULT (50 pre-verified full books)
   * ========================================================================= */
  function renderVault(filterCat = 'ALL', search = '') {
    const grid = document.getElementById('upsc-vault-grid');
    if (!grid) return;
    grid.innerHTML = '';
    let books = DATA.UPSC_BOOK_VAULT.filter(b => {
      if (filterCat !== 'ALL' && b.subject !== filterCat) return false;
      const s = search.toLowerCase();
      return !s || b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s) || b.subject.toLowerCase().includes(s);
    });
    if (!books.length) {
      grid.innerHTML = `<div class="col-span-full text-center py-12 arcade-card p-6"><i class="fa-solid fa-magnifying-glass text-3xl text-slate-700 mb-2 block"></i><div class="text-slate-400">No matching tomes in the vault.</div></div>`;
      return;
    }
    books.forEach(b => {
      const already = state.bookshelf.some(x => x.id === b.id);
      const card = document.createElement('div');
      card.className = 'arcade-card p-4 flex flex-col';
      const rarityClass = { Common: 'text-slate-300', Rare: 'text-cyan-300', Epic: 'text-fuchsia-300', Legendary: 'text-amber-300' }[b.rarity] || 'text-slate-300';
      card.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-sm text-slate-100 line-clamp-1">${escapeHtml(b.title)}</h3>
          <span class="text-[10px] font-arcade px-2 py-0.5 rounded border ${rarityClass.replace('text-', 'border-')}/50 ${rarityClass}">${b.rarity}</span>
        </div>
        <div class="text-xs text-slate-500 mb-2">${escapeHtml(b.author)}</div>
        <div class="flex items-center gap-1 text-[10px] text-slate-400 mb-3">
          <span>${b.subject}</span> <span>•</span> <span>${b.gsPaper}</span> <span>•</span> <span>${b.pages} pp</span>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed mb-3 flex-1">${escapeHtml(b.syllabus)}</p>
        <button class="arcade-btn w-full py-2 text-xs ${already ? 'opacity-50' : 'arcade-btn-gold'}" ${already ? 'disabled' : ''} data-vault-add="${b.id}">
          <i class="fa-solid fa-plus"></i> ${already ? 'EQUIPPED' : 'Equip Book'}
        </button>
      `;
      card.querySelector('button[data-vault-add]').addEventListener('click', () => {
        addToShelf(b);
      });
      grid.appendChild(card);
    });
  }

  /* =========================================================================
   * FULL-BOOK READER (Read Mode viewport)
   * ========================================================================= */
  const readerEls = {
    modal: document.getElementById('book-reader-modal'),
    close: document.getElementById('btn-close-reader'),
    title: document.getElementById('reader-book-title'),
    author: document.getElementById('reader-book-author'),
    subject: document.getElementById('reader-book-subject'),
    viewText: document.getElementById('reader-view-text'),
    viewFlipbook: document.getElementById('reader-view-flipbook'),
    viewDownloads: document.getElementById('reader-view-downloads'),
    prose: document.getElementById('reader-prose-content'),
    loading: document.getElementById('reader-loading-state'),
    sidebar: document.getElementById('reader-chapters-sidebar'),
    chapterList: document.getElementById('reader-chapter-list'),
    totalWords: document.getElementById('reader-total-words'),
    searchInput: document.getElementById('reader-search-input'),
    searchHits: document.getElementById('reader-search-hits'),
    pageIndicator: document.getElementById('reader-page-indicator'),
    pageSlider: document.getElementById('reader-page-slider'),
    btnPrev: document.getElementById('btn-prev-page'),
    btnNext: document.getElementById('btn-next-page'),
    iframe: document.getElementById('reader-flipbook-iframe'),
    iaLink: document.getElementById('reader-external-ia-link'),
    downloadsContent: document.getElementById('reader-downloads-content'),
    notesDrawer: document.getElementById('reader-notes-drawer'),
    notesTextarea: document.getElementById('reader-book-notes-textarea'),
    btnSaveNote: document.getElementById('btn-save-book-note'),
    btnToggleNotes: document.getElementById('btn-toggle-reader-notes'),
    btnCloseNotes: document.getElementById('btn-close-notes-drawer'),
    btnQuizBook: document.getElementById('btn-quiz-this-book'),
    btnFullscreen: document.getElementById('btn-reader-fullscreen'),
    btnNewTab: document.getElementById('btn-reader-new-tab')
  };

  let currentReaderBook = null;
  let readerPages = [];      // array of page strings
  let readerPageIdx = 0;
  let readerFontPx = 18;
  let readerTheme = 'cyber';
  let readerSearchTerm = '';
  let readerTtsUtterance = null;

  function openReader(book) {
    currentReaderBook = book;
    const m = readerEls.modal;
    if (!m) return;
    m.classList.remove('hidden');
    readerEls.title.textContent = book.title;
    readerEls.author.textContent = book.author;
    readerEls.subject.textContent = book.subject || 'Misc';
    readerEls.pageSlider.max = 1;
    readerEls.pageSlider.value = 1;
    readerEls.pageIndicator.textContent = `Page 1 / 1`;
    readerEls.prose.classList.add('hidden');
    readerEls.loading.classList.remove('hidden');
    readerEls.prose.innerHTML = '';

    // Default to text mode
    switchReaderMode('text');

    // Load full text
    loadReaderBookText(book).then(text => {
      readerEls.loading.classList.add('hidden');
      readerEls.prose.classList.remove('hidden');
      buildReaderPages(text);
      renderReaderPage();
      buildChapterList(text);
      updateReaderTheme();
      updateReaderFont();
      // cache text
      cacheBookText(book);
    }).catch(err => {
      readerEls.loading.innerHTML = `<div class="text-center py-10 text-rose-300"><i class="fa-solid fa-triangle-exclamation text-3xl mb-2 block"></i><div class="text-xs">Full-text stream unavailable for this title.<br>Use Original Scanned Flipbook or EPUB/PDF downloads below.</div></div>`;
      console.error(err);
    });

    // Load notes for this book
    const note = state.savedNotes.find(n => n.bookId === book.id);
    if (readerEls.notesTextarea) readerEls.notesTextarea.value = note ? note.text : '';
    document.getElementById('saved-notes-count').textContent = state.savedNotes.length + ' items';
  }

  function closeReader() {
    const m = readerEls.modal;
    if (m) m.classList.add('hidden');
    if (readerTtsUtterance) { window.speechSynthesis.cancel(); readerTtsUtterance = null; }
    currentReaderBook = null;
    readerPages = [];
    readerPageIdx = 0;
  }

  async function loadReaderBookText(book) {
    // 1. Cached?
    const cached = state.bookTexts.find(bt => bt.sourceId === book.id || (book.iaId && bt.sourceId === book.iaId));
    if (cached) return cached.text;

    // 2. Archive.org full text
    if (book.iaId) {
      try {
        const meta = await fetchJson(archiveFullTextUrl(book.iaId), 10000);
        const files = meta.files || [];
        const txtFile = files.find(f => f.name && f.name.endsWith('_djvu.txt'))
          || files.find(f => f.name && f.name.toLowerCase().endsWith('.txt'));
        if (txtFile) {
          const server = meta.server || meta.d1;
          const dir = meta.dir || '';
          const url = `https://${server}${dir}/${encodeURIComponent(txtFile.name)}`;
          const resp = await fetch(url, { headers: { 'Origin': 'https://example.com' } });
          if (!resp.ok) throw new Error('TXT fetch failed');
          const text = await resp.text();
          if (text && text.length > 500) return text;
        }
      } catch (e) {
        // fall through to EPUB/PDF links only
      }
    }

    // 3. Local imported text
    if (book.localText) return book.localText;

    throw new Error('No full text source available');
  }

  function cacheBookText(book) {
    if (!currentReaderBook) return;
    const srcId = currentReaderBook.iaId || currentReaderBook.id;
    const exists = state.bookTexts.find(bt => bt.sourceId === srcId);
    if (exists) {
      exists.title = currentReaderBook.title;
      exists.text = readerPages.join('\n\n');
    } else {
      state.bookTexts.push({ sourceId: srcId, title: currentReaderBook.title, text: readerPages.join('\n\n') });
    }
    saveState();
  }

  function paginateText(text, charsPerPage = 2600) {
    const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
    const pages = [];
    let cur = '';
    for (const p of paras) {
      if ((cur + '\n\n' + p).length <= charsPerPage) {
        cur = cur ? cur + '\n\n' + p : p;
      } else {
        if (cur) pages.push(cur);
        // If a single paragraph is huge, split it further
        if (p.length > charsPerPage) {
          for (let i = 0; i < p.length; i += charsPerPage) pages.push(p.slice(i, i + charsPerPage));
          cur = '';
        } else {
          cur = p;
        }
      }
    }
    if (cur) pages.push(cur);
    return pages.length ? pages : [text];
  }

  function buildReaderPages(text) {
    readerPages = paginateText(text);
    readerPageIdx = Math.min(readerPageIdx, readerPages.length - 1);
    const slider = readerEls.pageSlider;
    slider.max = readerPages.length;
    slider.value = readerPageIdx + 1;
    readerEls.pageIndicator.textContent = `Page ${readerPageIdx + 1} / ${readerPages.length}`;
    const wc = text.split(/\s+/).length;
    if (readerEls.totalWords) readerEls.totalWords.textContent = `≈ ${wc.toLocaleString()} words`;
  }

  function renderReaderPage() {
    if (!readerPages.length) return;
    const text = readerPages[readerPageIdx];
    // Simple paragraphization + highlight search term
    let html = text.split(/\n/).map(p => `<p class="mb-4 leading-relaxed">${escapeHtml(p)}</p>`).join('');
    if (readerSearchTerm) {
      const re = new RegExp(`(${escapeRegExp(readerSearchTerm)})`, 'gi');
      html = html.replace(re, '<mark class="bg-amber-400/30 text-amber-100 px-1 rounded">$1</mark>');
    }
    readerEls.prose.innerHTML = html;
    readerEls.pageSlider.value = readerPageIdx + 1;
    readerEls.pageIndicator.textContent = `Page ${readerPageIdx + 1} / ${readerPages.length}`;
    // scroll to top
    const surface = document.getElementById('reader-scroll-surface');
    if (surface) surface.scrollTop = 0;
    // XP per page (once per page per open)
    const key = `rp_${currentReaderBook.id}_${readerPageIdx + 1}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      addXP(XP_PER_PAGE, `Page ${readerPageIdx + 1}`, currentReaderBook.subject);
    }
    updateReaderBookmark();
  }

  function updateReaderBookmark() {
    if (!currentReaderBook) return;
    const shelfItem = state.bookshelf.find(b => b.id === currentReaderBook.id);
    if (shelfItem) {
      shelfItem.bookmarkedPage = readerPageIdx + 1;
      shelfItem.progress = Math.min(100, Math.round(((readerPageIdx + 1) / Math.max(1, readerPages.length)) * 100));
      saveState();
      renderBookshelf(currentShelfFilter);
      renderHUD();
    }
  }

  function buildChapterList(text) {
    const list = readerEls.chapterList;
    if (!list) return;
    list.innerHTML = '';
    const lines = text.split(/\n/);
    let chCount = 0;
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (/^(Chapter|CHAPTER)\s+[\dIVXLC]+/i.test(trimmed) || /^\d+\.\s+[A-Z]/.test(trimmed)) {
        const item = document.createElement('div');
        item.className = 'px-2 py-1.5 rounded text-xs cursor-pointer hover:bg-cyan-900/30 border border-transparent hover:border-cyan-500/40';
        item.textContent = trimmed.slice(0, 60);
        item.title = trimmed;
        item.addEventListener('click', () => {
          // jump to approximate page: char position / avg page chars
          const charPos = text.indexOf(trimmed);
          const page = Math.floor((charPos / Math.max(1, text.length)) * readerPages.length);
          readerPageIdx = Math.max(0, Math.min(page, readerPages.length - 1));
          renderReaderPage();
          readerEls.sidebar.classList.add('hidden');
        });
        list.appendChild(item);
        chCount++;
      }
    });
    if (!chCount) {
      list.innerHTML = `<div class="text-xs text-slate-500 italic">No chapter headings detected — use Search to navigate.</div>`;
    }
  }

  function updateReaderTheme() {
    const surface = document.getElementById('reader-prose-content');
    const view = readerEls.viewText;
    const themeClass = `reader-surface-${readerTheme}`;
    if (view) {
      view.className = 'flex-1 flex flex-col overflow-hidden reader-surface-' + readerTheme;
    }
    if (surface) surface.className = 'reader-prose font-reader ' + themeClass;
  }

  function updateReaderFont() {
    const surface = document.getElementById('reader-prose-content');
    if (surface) surface.style.fontSize = readerFontPx + 'px';
    if (readerEls.pageIndicator) {} // noop
    const lbl = document.getElementById('reader-font-label');
    if (lbl) lbl.textContent = readerFontPx + 'px';
  }

  function switchReaderMode(mode) {
    if (!readerEls) return;
    readerEls.viewText.classList.add('hidden');
    readerEls.viewFlipbook.classList.add('hidden');
    readerEls.viewDownloads.classList.add('hidden');
    document.querySelectorAll('.reader-mode-btn').forEach(b => b.classList.remove('arcade-btn-gold', 'border-cyan-400', 'bg-cyan-950/30', 'text-cyan-300'));
    const active = document.querySelector(`.reader-mode-btn[data-reader-mode="${mode}"]`);
    if (active) {
      active.classList.add('arcade-btn-gold', 'border-cyan-400', 'bg-cyan-950/30', 'text-cyan-300');
    }
    if (mode === 'text') readerEls.viewText.classList.remove('hidden');
    else if (mode === 'flipbook') {
      readerEls.viewFlipbook.classList.remove('hidden');
      if (currentReaderBook && currentReaderBook.iaId) {
        const embedUrl = `https://archive.org/embed/${encodeURIComponent(currentReaderBook.iaId)}?view=theater&ui=embed&wrapper=false`;
        readerEls.iframe.src = embedUrl;
        if (readerEls.iaLink) readerEls.iaLink.href = `https://archive.org/details/${encodeURIComponent(currentReaderBook.iaId)}`;
      }
    } else if (mode === 'downloads') {
      readerEls.viewDownloads.classList.remove('hidden');
      renderReaderDownloads();
    }
  }

  function toggleReaderFullscreen() {
    const modal = readerEls.modal;
    if (!modal) return;
    const isFullscreen = modal.classList.contains('reader-fullscreen');
    if (!isFullscreen) {
      // Enter fullscreen
      if (modal.requestFullscreen) {
        modal.requestFullscreen().catch(() => {
          // Fallback: just expand the modal visually
          modal.classList.add('reader-fullscreen');
          updateReaderFullscreenUI(true);
        });
      } else {
        modal.classList.add('reader-fullscreen');
        updateReaderFullscreenUI(true);
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      modal.classList.remove('reader-fullscreen');
      updateReaderFullscreenUI(false);
    }
  }

  function openReaderBookInNewTab(book) {
    if (!book) return;
    const b = book;
    const urlCandidates = [];

    // Prefer: Archive.org details page (full scanned reader) > Direct PDF > EPUB > Full Text TXT > Open Library
    if (b.iaId) {
      urlCandidates.push(`https://archive.org/details/${encodeURIComponent(b.iaId)}`);
    }
    if (b.olKey) {
      urlCandidates.push(`https://openlibrary.org/books/${encodeURIComponent(b.olKey)}`);
    }
    if (b.iaId) {
      urlCandidates.push(`https://archive.org/download/${encodeURIComponent(b.iaId)}/${encodeURIComponent(b.iaId + '_text.pdf')}`);
    }
    if (b.iaId) {
      urlCandidates.push(`https://archive.org/download/${encodeURIComponent(b.iaId)}/${encodeURIComponent(b.iaId + '.epub')}`);
    }
    if (b.iaId) {
      urlCandidates.push(`https://archive.org/download/${encodeURIComponent(b.iaId)}/${encodeURIComponent(b.iaId)}_djvu.txt`);
    }

    const targetUrl = urlCandidates[0] || `https://archive.org/search?q=${encodeURIComponent(b.title + ' ' + b.author)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening book in new tab…', 'info');
  }

  function updateReaderFullscreenUI(isFullscreen) {
    const btn = readerEls.btnFullscreen;
    if (!btn) return;
    btn.innerHTML = isFullscreen
      ? `<i class="fa-solid fa-compress"></i> Exit Fullscreen`
      : `<i class="fa-solid fa-expand"></i> Fullscreen`;
    btn.title = isFullscreen ? 'Exit Fullscreen Reader' : 'Toggle Fullscreen Reader';
    // Adjust reader surface height
    const surface = document.getElementById('reader-scroll-surface');
    if (surface) {
      // The CSS handles height via .reader-fullscreen selector
    }
  }

  function renderReaderDownloads() {
    const box = readerEls.downloadsContent;
    if (!box) return;
    box.innerHTML = '';
    const b = currentReaderBook;
    const items = [];
    if (b.iaId) {
      items.push({ label: 'Full Text (.txt)', url: `https://archive.org/download/${encodeURIComponent(b.iaId)}/${encodeURIComponent(b.iaId)}_djvu.txt`, type: 'text' });
    }
    // best-guess file names
    if (b.iaId) {
      items.push({ label: 'Original PDF', url: `https://archive.org/download/${encodeURIComponent(b.iaId)}/${encodeURIComponent(b.iaId + '_text.pdf')}`, type: 'pdf' });
      items.push({ label: 'EPUB', url: `https://archive.org/download/${encodeURIComponent(b.iaId)}/${encodeURIComponent(b.iaId + '.epub')}`, type: 'epub' });
    }
    if (b.olKey) items.push({ label: 'Open Library Reader', url: `https://openlibrary.org/books/${encodeURIComponent(b.olKey)}`, type: 'link' });
    items.push({ label: 'Internet Archive Details', url: `https://archive.org/details/${encodeURIComponent(b.iaId || b.id)}`, type: 'link' });
    items.forEach(it => {
      const el = document.createElement('a');
      el.href = it.url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.className = 'block arcade-btn px-4 py-3 text-xs sm:text-sm justify-between w-full';
      el.innerHTML = `<span>${escapeHtml(it.label)}</span> <i class="fa-solid fa-arrow-up-right-from-square text-xs opacity-70"></i>`;
      box.appendChild(el);
    });
    if (!items.length) box.innerHTML = `<div class="text-xs text-slate-400">No direct file links available for this item.</div>`;
  }

  /* =========================================================================
   * QUIZ ARENA (infinite procedural dungeon + mocks)
   * ========================================================================= */
  let quizState = {
    mode: 'infinite', // infinite | mock | book | mistakes
    subject: 'ALL',
    current: null,
    solved: 0,
    correct: 0,
    marks: 0,
    answered: false,
    eliminated: new Set(),
    totalQ: 10,
    qIndex: 0,
    startTime: 0,
    timer: null,
    timeElapsed: 0
  };

  let tabTransitionLock = false;

  function showTab(tabId) {
    if (tabTransitionLock) return;
    const currentActive = document.querySelector('.tab-panel.active');
    const target = document.getElementById(`tab-${tabId}`);
    if (!target || target === currentActive) return;

    // Fade out current
    tabTransitionLock = true;
    if (currentActive) {
      currentActive.classList.remove('active');
      currentActive.classList.add('fade-out');
      setTimeout(() => currentActive.classList.remove('fade-out'), 280);
    }

    // Fade in target after a brief overlap
    setTimeout(() => {
      target.classList.add('active');
      tabTransitionLock = false;
    }, 120);

    // Nav button states
    document.querySelectorAll('.nav-tab-btn').forEach(b => {
      const active = b.dataset.tab === tabId;
      if (active) {
        b.classList.add('focus-btn-accent', 'border-cyan-400', 'bg-cyan-950/20', 'text-cyan-300');
        b.classList.remove('focus-btn');
      } else {
        b.classList.remove('focus-btn-accent', 'border-cyan-400', 'bg-cyan-950/20', 'text-cyan-300');
        b.classList.add('focus-btn');
      }
    });

    // Tab-specific renders
    if (tabId === 'sanctum') renderBookshelf(currentShelfFilter);
    if (tabId === 'grabber') renderVault(currentVaultCat, currentVaultSearch);
    if (tabId === 'hero') { renderBadgesVault(); renderAvatarSelector(); renderHeroStats(); renderSavedNotes(); }
    if (tabId === 'ca') renderCA();
    if (tabId === 'pyq') renderPYQ();
    if (tabId === 'mains') { renderMainsPrompts(); renderMainsEditor(); renderMainsSaved(); updateMainsUI(); }
    if (tabId === 'flashcards') { renderFlashcardsUI(); studyFlashcards(); }
    if (tabId === 'highlights') renderHighlights();
    if (tabId === 'analytics') renderAnalytics();
    if (tabId === 'goal') renderGoalTracker();
    location.hash = '#' + tabId;
  }

  function bindNav() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
  }

  function renderQuizControls() {
    const modeBtns = document.querySelectorAll('.quiz-mode-btn');
    modeBtns.forEach(b => {
      const active = b.dataset.quizMode === quizState.mode;
      b.classList.toggle('arcade-btn-gold', active);
      b.classList.toggle('border-cyan-400', active);
      if (!active) b.classList.remove('arcade-btn-gold', 'border-cyan-400', 'bg-cyan-950/20', 'text-cyan-300');
    });
    const subj = document.getElementById('quiz-subject-select');
    const len = document.getElementById('mock-length-select');
    const newBtn = document.getElementById('btn-new-mock');
    if (subj) {
      subj.value = quizState.subject;
      subj.classList.toggle('hidden', false);
    }
    if (len) len.classList.toggle('hidden', quizState.mode !== 'mock');
    if (newBtn) newBtn.classList.toggle('hidden', quizState.mode !== 'mock');
  }

  function startQuiz() {
    quizState.solved = 0;
    quizState.correct = 0;
    quizState.marks = 0;
    quizState.answered = false;
    quizState.eliminated = new Set();
    quizState.qIndex = 0;
    quizState.startTime = Date.now();
    if (quizState.timer) clearInterval(quizState.timer);
    if (quizState.mode === 'mock') {
      quizState.timer = setInterval(() => {
        quizState.timeElapsed++;
        document.getElementById('quiz-timer-badge').textContent = fmtTime(quizState.timeElapsed);
      }, 1000);
      document.getElementById('quiz-timer-badge').textContent = '00:00';
    } else {
      document.getElementById('quiz-timer-badge').textContent = '♾️ ENDLESS';
    }
    document.getElementById('quiz-question-card').classList.remove('hidden');
    document.getElementById('mock-summary-card').classList.add('hidden');
    document.getElementById('q-explanation-box').classList.add('hidden');
    spawnQuizMonster(quizState.subject);
    nextQuizQuestion();
    updateQuizHUD();
  }

  function spawnQuizMonster(subject) {
    let pool = DATA.MONSTERS.filter(m => m.subject === subject || subject === 'ALL');
    if (!pool.length) pool = DATA.MONSTERS;
    // Boss appears every 10 waves
    const bossy = (quizState.qIndex % 10 === 0 && quizState.qIndex > 0);
    let m;
    if (bossy) m = DATA.MONSTERS.find(x => x.id === 'm-boss') || pool[0];
    else m = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById('monster-icon').className = `fa-solid ${m.icon} text-5xl ${m.color === '#00f5d4' ? 'text-cyan-300' : m.color === '#ff9f1c' ? 'text-amber-400' : m.color === '#f472b6' ? 'text-pink-400' : m.color === '#38bdf8' ? 'text-sky-400' : m.color === '#ffd166' ? 'text-amber-300' : m.color === '#10b981' ? 'text-emerald-400' : m.color === '#a855f7' ? 'text-fuchsia-400' : m.color === '#ec4899' ? 'text-rose-400' : m.color === '#f43f5e' ? 'text-rose-500' : 'text-rose-600'}`;
    document.getElementById('monster-name').textContent = m.name;
    document.getElementById('monster-taunt').textContent = `"${m.taunt}"`;
    document.getElementById('monster-wave-badge').textContent = `WAVE #${quizState.qIndex + 1}`;
    document.getElementById('monster-hp-fill').style.width = '100%';
    document.getElementById('monster-hp-text').textContent = `${m.hp} / ${m.hp}`;
    quizState.monsterHp = m.hp;
    quizState.monsterMaxHp = m.hp;
    quizState.currentMonster = m;
    document.getElementById('monster-stage').classList.remove('monster-hit');
    void document.getElementById('monster-stage').offsetHeight;
  }

  function nextQuizQuestion() {
    quizState.answered = false;
    quizState.eliminated = new Set();
    document.getElementById('q-explanation-box').classList.add('hidden');
    document.getElementById('btn-next-question').classList.add('hidden');
    const optsBox = document.getElementById('q-options-list');
    optsBox.innerHTML = '<div class="text-center py-6 text-slate-400"><i class="fa-solid fa-circle-notch fa-spin"></i> Generating UPSC question…</div>';
    document.getElementById('btn-5050-lifeline').disabled = false;
    document.getElementById('btn-5050-lifeline').classList.remove('opacity-50');

    setTimeout(() => {
      const bookTexts = quizState.mode === 'book'
        ? state.bookTexts.filter(bt => state.bookshelf.some(b => b.id === bt.sourceId || b.iaId === bt.sourceId))
        : [];
      const q = DATA.generateProceduralQuestion(quizState.subject, bookTexts);
      quizState.current = q;
      renderQuizQuestion(q);
      playSfx('click');
    }, 250);
  }

  function renderQuizQuestion(q) {
    const box = document.getElementById('q-options-list');
    box.innerHTML = '';
    document.getElementById('q-subject-badge').textContent = q.subject;
    document.getElementById('q-type-badge').textContent = q.type;
    document.getElementById('q-prompt-text').textContent = q.prompt;
    q.options.forEach((opt, i) => {
      const item = document.createElement('div');
      item.className = 'group relative';
      item.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-slate-700 bg-slate-900/80 text-sm sm:text-base text-slate-200 cursor-pointer hover:border-cyan-400/50 hover:bg-slate-800 transition-all" data-opt="${i}">
          <span class="w-7 h-7 rounded-full border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300 shrink-0">${String.fromCharCode(65 + i)}</span>
          <span class="flex-1 whitespace-pre-line">${escapeHtml(opt)}</span>
          <button class="text-slate-500 hover:text-rose-400 transition opacity-0 group-hover:opacity-100" data-elim="${i}" title="Eliminate option">
            <i class="fa-solid fa-eye-slash"></i>
          </button>
        </div>
      `;
      item.querySelector('[data-opt]').addEventListener('click', () => handleQuizAnswer(i));
      item.querySelector('[data-elim]').addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (quizState.answered) return;
        quizState.eliminated.add(i);
        const el = item.querySelector('[data-opt]');
        el.classList.add('option-eliminated');
        el.querySelector('[data-elim]').style.display = 'none';
        playSfx('click');
        showToast('Option eliminated (UPSC technique)', 'info');
      });
      box.appendChild(item);
    });
  }

  function handleQuizAnswer(idx) {
    if (quizState.answered) return;
    const q = quizState.current;
    quizState.answered = true;
    const correct = idx === q.answer;
    const items = document.querySelectorAll('[data-opt]');
    items.forEach((el, i) => {
      el.style.cursor = 'default';
      if (i === q.answer) el.classList.add('ring-2', 'ring-emerald-400', 'ring-offset-2');
      if (i === idx && i !== q.answer) el.classList.add('bg-rose-900/60', 'border-rose-500');
    });

    if (correct) {
      quizState.solved++;
      quizState.correct++;
      quizState.marks += 2;
      state.streak = (state.streak || 0) + 1;
      quizState.monsterHp = Math.max(0, quizState.monsterHp - 25);
      document.getElementById('monster-hp-fill').style.width = `${(quizState.monsterHp / quizState.monsterMaxHp) * 100}%`;
      document.getElementById('monster-hp-text').textContent = `${quizState.monsterHp} / ${quizState.monsterMaxHp}`;
      document.getElementById('monster-stage').classList.add('monster-hit');
      setTimeout(() => document.getElementById('monster-stage').classList.remove('monster-hit'), 450);
      playSfx('correct');
      addXP(15, 'Correct Answer', q.subject);
      showFloatingXP(window.innerWidth / 2, 180, 15);
      showResultBanner(true, q, `Correct! Monster HP −25.`);
    } else {
      quizState.solved++;
      state.streak = 0;
      quizState.marks = Math.max(-100, quizState.marks - 0.66);
      playSfx('wrong');
      screenShake();
      addXP(5, 'Attempt', q.subject);
      showResultBanner(false, q, `Negative marking −0.66. Study the text and strike back!`);
      recordMistake(q, idx);
    }

    updateQuizHUD();
    saveState();
    revealExplanation(q);
    document.getElementById('btn-next-question').classList.remove('hidden');

    if (quizState.mode === 'mock' && quizState.qIndex + 1 >= quizState.totalQ) {
      setTimeout(showMockSummary, 700);
    }
    if (quizState.monsterHp <= 0) {
      playSfx('badge');
      spawnConfetti(60);
      setTimeout(() => { spawnQuizMonster(quizState.subject); }, 900);
    }
  }

  function showResultBanner(correct, q, msg) {
    const banner = document.getElementById('q-result-banner');
    const box = document.getElementById('q-explanation-box');
    banner.textContent = correct ? `✓ ${msg} +2.00 marks • +15 XP` : `✗ ${msg} −0.66 marks`;
    banner.className = `font-arcade text-xs ${correct ? 'text-emerald-400' : 'text-rose-400'}`;
    box.classList.remove('hidden');
  }

  function revealExplanation(q) {
    const el = document.getElementById('q-explanation-text');
    if (el) el.textContent = q.explanation;
  }

  function recordMistake(q, userIdx) {
    state.mistakes = state.mistakes.filter(m => m.questionId !== q.id);
    state.mistakes.unshift({
      questionId: q.id,
      question: q.prompt,
      options: q.options,
      correctAnswer: q.answer,
      userAnswer: userIdx,
      explanation: q.explanation,
      subject: q.subject,
      at: Date.now()
    });
    if (state.mistakes.length > 200) state.mistakes.length = 200;
    document.getElementById('mistake-count-pill').textContent = state.mistakes.length;
  }

  function showMockSummary() {
    clearInterval(quizState.timer);
    const card = document.getElementById('mock-summary-card');
    const pct = quizState.solved ? Math.round((quizState.correct / quizState.solved) * 100) : 0;
    card.innerHTML = `
      <h3 class="font-arcade text-xs text-amber-300 mb-1">MOCK TEST COMPLETE</h3>
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="p-3 rounded-lg bg-slate-900 border border-cyan-400/30 text-center"><div class="text-[10px] text-slate-400">Marks Scored</div><div class="font-arcade text-xs text-cyan-300">${quizState.marks.toFixed(2)} / ${quizState.totalQ * 2}</div></div>
        <div class="p-3 rounded-lg bg-slate-900 border border-amber-400/30 text-center"><div class="text-[10px] text-slate-400">Accuracy</div><div class="font-arcade text-xs text-amber-300">${pct}%</div></div>
        <div class="p-3 rounded-lg bg-slate-900 border border-fuchsia-400/30 text-center"><div class="text-[10px] text-slate-400">Questions</div><div class="font-arcade text-xs text-fuchsia-300">${quizState.correct}/${quizState.solved}</div></div>
      </div>
      <div class="text-xs text-slate-300 mb-3">${quizState.marks >= quizState.totalQ * 1.2 ? 'Prelims clearance trajectory!' : 'Revise weak areas in the Mistake Boss dungeon.'}</div>
      <button id="btn-restart-mock" class="arcade-btn arcade-btn-gold w-full py-2.5 text-xs sm:text-sm"><i class="fa-solid fa-rotate"></i> New Mock</button>
    `;
    card.classList.remove('hidden');
    document.getElementById('quiz-question-card').classList.add('hidden');
    card.querySelector('#btn-restart-mock').addEventListener('click', () => {
      card.classList.add('hidden');
      startQuiz();
    });
  }

  function updateQuizHUD() {
    document.getElementById('stat-upsc-marks').textContent = quizState.marks.toFixed(2);
    document.getElementById('stat-accuracy').textContent = quizState.solved ? Math.round((quizState.correct / quizState.solved) * 100) + '%' : '0%';
    document.getElementById('stat-solved').textContent = quizState.solved;
    renderHUD();
  }

  /* =========================================================================
   * DAILY QUEST BOARD (gamified to-do)
   * ========================================================================= */
  const QUEST_TEMPLATES = [
    { text: 'Revise NCERT Polity Chapters 1–3 (Articles 12–51)', tag: 'Polity' },
    { text: 'Complete 20 Indian Polity MCQs in Quiz Dungeon', tag: 'Polity' },
    { text: 'Read one full chapter of an equipped book', tag: 'History' },
    { text: 'Practice 2 CSAT comprehension passages', tag: 'CSAT' },
    { text: 'Write one GS-II mains answer (250 words)', tag: 'Polity' },
    { text: 'Make revision notes on Article 368 amendments', tag: 'Polity' },
    { text: 'Revise Spectrum Modern India Ch. 5–8', tag: 'History' },
    { text: 'Attempt previous year Prelims set', tag: 'History' },
    { text: 'Geography: map practice — Indian river systems', tag: 'Geography' },
    { text: 'Ethics: solve one administrative case study', tag: 'Ethics' },
    { text: 'Revise Laxmikanth: Parliament & State Legislatures', tag: 'Polity' },
    { text: 'Read Bipan Chandra: Revolt of 1857 chapter', tag: 'History' }
  ];

  function renderQuestBoard() {
    const list = document.getElementById('quest-list');
    if (!list) return;
    list.innerHTML = '';
    if (!state.quests.length) {
      list.innerHTML = `<div class="text-center py-6 text-slate-500 text-xs italic">No active quests. Generate a daily set to begin!</div>`;
      return;
    }
    state.quests.forEach(q => {
      const el = document.createElement('div');
      el.className = `quest-item arcade-card p-3 flex items-center gap-3 ${q.done ? 'opacity-60' : ''}`;
      el.innerHTML = `
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold ${tagColor(q.tag)} uppercase tracking-wider">${escapeHtml(q.tag)}</span>
            ${q.done ? '<span class="text-[10px] text-emerald-400 font-bold">✓ COMPLETED</span>' : ''}
          </div>
          <div class="text-xs sm:text-sm ${q.done ? 'line-through text-slate-500' : 'text-slate-200'}">${escapeHtml(q.text)}</div>
        </div>
        <div class="flex items-center gap-2">
          ${!q.done ? `<button class="arcade-btn arcade-btn-gold px-2.5 py-1.5 text-[10px]" data-quest-toggle="${q.id}" title="Slash quest +50 XP"><i class="fa-solid fa-sword"></i></button>` : ''}
          <button class="text-[10px] text-rose-400 hover:text-rose-200" data-quest-del="${q.id}" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;
      const tgBtn = el.querySelector('[data-quest-toggle]');
      if (tgBtn) tgBtn.addEventListener('click', () => completeQuest(q.id, el));
      el.querySelector('[data-quest-del]').addEventListener('click', () => deleteQuest(q.id));
      list.appendChild(el);
    });
  }

  function tagColor(tag) {
    const c = { Polity: 'text-cyan-400', History: 'text-amber-400', Geography: 'text-emerald-400', Economy: 'text-fuchsia-400', Environment: 'text-emerald-300', Ethics: 'text-rose-400', CSAT: 'text-sky-400' };
    return c[tag] || 'text-slate-400';
  }

  function completeQuest(id, el) {
    const q = state.quests.find(x => x.id === id);
    if (!q || q.done) return;
    q.done = true;
    addXP(50, 'Quest Complete', q.tag);
    state.streak = (state.streak || 0) + 1;
    playSfx('slash');
    screenShake();
    saveState();
    renderQuestBoard();
    renderHUD();
    // Goal progress
    const wk = getWeekKey(new Date());
    state.goalsProgress = state.goalsProgress || {};
    state.goalsProgress[wk] = state.goalsProgress[wk] || { books: 0, quiz: 0, mains: 0 };
    state.goalsProgress[wk].books = (state.goalsProgress[wk].books || 0) + 1;
    saveState();
    renderGoalTracker();

    if (!el) {
      const btn = Array.from(document.querySelectorAll('[data-quest-toggle]')).find(b => b.dataset.questToggle === id);
      el = btn ? btn.closest('.quest-item') : null;
    }
    if (!el) return;
    el.classList.add('quest-slashing');
    const rect = el.getBoundingClientRect();
    showFloatingXP(rect.left + rect.width / 2, rect.top, 50);
    setTimeout(() => {
      el.style.opacity = '0.55';
      const tg = el.querySelector('button[data-quest-toggle]');
      if (tg) tg.style.display = 'none';
      const nameEl = el.querySelector('.text-slate-200');
      if (nameEl) nameEl.classList.add('line-through', 'text-slate-500');
      if (!el.querySelector('.text-emerald-400')) {
        const wrap = el.querySelector('.flex.items-center.gap-2.mb-1');
        if (wrap) wrap.insertAdjacentHTML('beforeend', '<span class="text-[10px] text-emerald-400 font-bold ml-2">✓ COMPLETED</span>');
      }
    }, 450);
  }

  function deleteQuest(id) {
    state.quests = state.quests.filter(x => x.id !== id);
    saveState();
    renderQuestBoard();
  }

  function seedQuests() {
    const picked = shuffle([...QUEST_TEMPLATES]).slice(0, 5);
    picked.forEach((t, i) => {
      state.quests.push({ id: `q-${Date.now()}-${i}`, text: t.text, tag: t.tag, done: false, createdAt: Date.now() });
    });
    saveState();
    renderQuestBoard();
    showToast('Daily quest set generated!', 'success');
    spawnConfetti(40);
  }

  /* =========================================================================
   * AVATAR, BADGES, HERO STATS, SAVED NOTES
   * ========================================================================= */
  function renderAvatarSelector() {
    const grid = document.getElementById('avatar-selector-grid');
    if (!grid) return;
    grid.innerHTML = '';
    DATA.AVATARS.forEach(a => {
      const active = state.avatarId === a.id;
      const el = document.createElement('div');
      el.className = `arcade-card p-3 text-center cursor-pointer ${active ? 'ring-2 ring-amber-400 bg-[#16264c]' : 'hover:border-cyan-400/50'}`;
      el.innerHTML = `
        <div class="w-14 h-14 rounded-2xl border-4 border-slate-700 mx-auto mb-2 flex items-center justify-center ${a.color === '#00f5d4' ? 'bg-cyan-950/40 text-cyan-300' : a.color === '#ffd166' ? 'bg-amber-950/40 text-amber-300' : a.color === '#b5179e' ? 'bg-fuchsia-950/40 text-fuchsia-300' : a.color === '#f72585' ? 'bg-rose-950/40 text-rose-300' : a.color === '#10b981' ? 'bg-emerald-950/40 text-emerald-300' : 'bg-orange-950/40 text-orange-300'}">
          <i class="fa-solid ${a.icon} text-xl"></i>
        </div>
        <div class="font-bold text-xs text-slate-100">${escapeHtml(a.name)}</div>
        <div class="text-[10px] text-slate-500">${escapeHtml(a.desc)}</div>
      `;
      el.addEventListener('click', () => {
        state.avatarId = a.id;
        saveState();
        renderAvatarSelector();
        renderHUD();
        showToast(`Avatar switched to ${a.name}`, 'success');
      });
      grid.appendChild(el);
    });
  }

  function renderBadgesVault() {
    const grid = document.getElementById('badges-vault-grid');
    if (!grid) return;
    grid.innerHTML = '';
    DATA.BADGES.forEach(b => {
      const unlocked = state.badgesUnlocked.includes(b.id);
      const el = document.createElement('div');
      el.className = `arcade-card p-3 text-center ${unlocked ? 'border-cyan-400/50 bg-cyan-950/20' : 'opacity-40 grayscale hover:opacity-100 transition'}`;
      el.innerHTML = `
        <div class="w-12 h-12 rounded-xl border-2 mx-auto mb-2 flex items-center justify-center ${unlocked ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-600'}">
          <i class="fa-solid ${b.icon} text-lg"></i>
        </div>
        <div class="font-bold text-[10px] text-slate-200 leading-tight">${escapeHtml(b.name)}</div>
        <div class="text-[9px] ${unlocked ? 'text-emerald-400' : 'text-slate-500'}">${unlocked ? 'UNLOCKED' : 'LOCKED'}</div>
      `;
      grid.appendChild(el);
    });
  }

  function renderHeroStats() {
    const grid = document.getElementById('hero-stats-grid');
    if (!grid) return;
    const totalXp = state.xp;
    const nextLvl = xpToReachLevel(state.level + 1);
    const stats = [
      { label: 'Level', val: state.level },
      { label: 'Total XP', val: totalXp.toLocaleString() },
      { label: 'XP to Next', val: Math.max(0, nextLvl - totalXp).toLocaleString() },
      { label: 'Bookshelf', val: state.bookshelf.length },
      { label: 'Quests Done', val: state.quests.filter(q => q.done).length + '/' + state.quests.length },
      { label: 'Relics', val: state.badgesUnlocked.length + '/' + DATA.BADGES.length },
      { label: 'Mistakes Logged', val: state.mistakes.length },
      { label: 'Saved Notes', val: state.savedNotes.length }
    ];
    grid.innerHTML = stats.map(s => `
      <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
        <div class="text-[10px] text-slate-500 uppercase">${s.label}</div>
        <div class="font-arcade text-xs text-cyan-300 mt-0.5">${s.val}</div>
      </div>
    `).join('');
  }

  function renderSavedNotes() {
    const list = document.getElementById('saved-notes-list');
    const count = document.getElementById('saved-notes-count');
    if (!list) return;
    list.innerHTML = '';
    if (count) count.textContent = state.savedNotes.length + ' items';
    if (!state.savedNotes.length) {
      list.innerHTML = `<div class="text-center py-6 text-slate-500 text-xs italic">Bookmark questions or save reader margin notes here.</div>`;
      return;
    }
    state.savedNotes.slice().reverse().forEach(n => {
      const el = document.createElement('div');
      el.className = 'arcade-card p-2.5';
      el.innerHTML = `
        <div class="text-xs font-bold text-cyan-300 mb-0.5">${escapeHtml(n.bookId || 'Quiz')}</div>
        <div class="text-[10px] text-slate-300 leading-relaxed mb-1">${escapeHtml(n.text)}</div>
        <div class="text-[9px] text-slate-500">${new Date(n.at).toLocaleString()}</div>
      `;
      list.appendChild(el);
    });
  }

  /* =========================================================================
   * SUBJECT XP HELPER
   * ========================================================================= */
  function getSubjectXP(subject) {
    return (state.subjectXP && state.subjectXP[subject]) || 0;
  }

  /* =========================================================================
   * FEATURE 1: DAILY CURRENT AFFAIRS
   * ========================================================================= */
  async function renderCA() {
    const list = document.getElementById('ca-list');
    if (!list) return;
    list.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs">Loading current affairs…</div>';
    let items = CURRENT_AFFAIRS_DATA.seed.slice();
    try {
      const live = await CURRENT_AFFAIRS_DATA.fetchLiveCA();
      if (live && live.length) items = live.concat(items.slice(0, 12));
    } catch (e) { /* use seed */ }
    list.innerHTML = '';
    items.forEach(it => {
      const el = document.createElement('div');
      el.className = 'focus-card p-3';
      el.innerHTML = `
        <div class="flex justify-between items-start gap-2 mb-1">
          <span class="text-[10px] font-bold text-cyan-300 uppercase">${escapeHtml(it.subject)}</span>
          <span class="text-[10px] text-slate-500">${escapeHtml(it.date)}</span>
        </div>
        <div class="font-bold text-sm text-slate-100 mb-1">${escapeHtml(it.title)}</div>
        <div class="text-xs text-slate-300 leading-relaxed mb-2">${escapeHtml(it.summary)}</div>
        <div class="flex items-center gap-2 text-[10px] text-slate-500">
          <span>GS ${escapeHtml(it.gsPaper)}</span>
          <span>• ${escapeHtml(it.source)}</span>
        </div>
        <div class="mt-2 flex gap-2">
          <a href="${escapeHtml(it.link)}" target="_blank" rel="noopener" class="focus-btn px-3 py-1 text-[10px]"><i class="fa-solid fa-external-link-alt"></i> Source</a>
        </div>
      `;
      list.appendChild(el);
    });
  }

  /* =========================================================================
   * FEATURE 2: PYQ BANK
   * ========================================================================= */
  function renderPYQ() {
    const list = document.getElementById('pyq-list');
    const subjSel = document.getElementById('pyq-subject');
    const yearSel = document.getElementById('pyq-year');
    if (!list || !subjSel || !yearSel) return;

    // Populate year options
    const years = [...new Set(DATA.STATIC_QUESTIONS.map(q => q.year).filter(Boolean))].sort((a, b) => b - a);
    yearSel.innerHTML = '<option value="ALL">All Years</option>' + years.map(y => `<option value="${y}">${y}</option>`).join('');

    const subj = subjSel.value;
    const year = yearSel.value;
    let filtered = DATA.STATIC_QUESTIONS.filter(q =>
      (subj === 'ALL' || q.subject === subj) && (year === 'ALL' || q.year == year)
    );

    list.innerHTML = '';
    if (!filtered.length) {
      list.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs">No questions match the selected filters.</div>';
      return;
    }
    filtered.forEach(q => {
      const el = document.createElement('div');
      el.className = 'focus-card p-3';
      const ansIdx = q.answer;
      el.innerHTML = `
        <div class="flex justify-between items-start mb-1">
          <span class="text-[10px] font-bold text-cyan-300 uppercase">${escapeHtml(q.subject)}</span>
          <span class="text-[10px] text-slate-500">PYQ ${q.year}</span>
          <span class="text-[10px] font-bold text-slate-400">${q.type}</span>
        </div>
        <div class="text-sm text-slate-100 leading-relaxed mb-2 whitespace-pre-line">${escapeHtml(q.prompt)}</div>
        <div class="text-xs text-slate-400 mb-2"><strong>Answer:</strong> ${String.fromCharCode(65 + ansIdx)}. ${escapeHtml(q.options[ansIdx])}</div>
        <details class="text-xs text-slate-300 leading-relaxed">
          <summary class="cursor-pointer text-cyan-300">Explanation</summary>
          <div class="mt-1">${escapeHtml(q.explanation)}</div>
        </details>
      `;
      list.appendChild(el);
    });
  }

  /* =========================================================================
   * FEATURE 3: MAINS ANSWER WRITING
   * ========================================================================= */
  const MAINS_PROMPTS = [
    { id: 'm1', gs: 'GS-II', prompt: 'Discuss the significance of the 106th Constitutional Amendment Act in enhancing women\'s political participation in India.', words: 250 },
    { id: 'm2', gs: 'GS-III', prompt: 'Examine the role of the National Green Hydrogen Mission in India\'s transition to a net-zero economy.', words: 250 },
    { id: 'm3', gs: 'GS-I', prompt: 'Assess the impact of the Ryotwari and Mahalwari land revenue systems on Indian agrarian society under British rule.', words: 250 },
    { id: 'm4', gs: 'GS-IV', prompt: 'What is the "Golden Mean" in Aristotelian ethics, and how can it guide a civil servant in decision-making?', words: 150 },
    { id: 'm5', gs: 'GS-III', prompt: 'Analyze the implications of Artificial Intelligence on internal security and employment in India.', words: 250 },
    { id: 'm6', gs: 'GS-II', prompt: 'Critically evaluate the functioning of the Collegium system for judicial appointments in India.', words: 250 },
    { id: 'm7', gs: 'GS-I', prompt: 'To what extent did the Swadeshi Movement contribute to the growth of nationalist consciousness in India?', words: 250 },
    { id: 'm8', gs: 'GS-IV', prompt: 'Discuss the relevance of "Nishkama Karma" (detachment from results) in public administration.', words: 150 }
  ];

  let mainsState = { currentId: null, timeLeft: 25 * 60, running: false, interval: null };

  function renderMainsPrompts() {
    const box = document.getElementById('mains-prompt-list');
    if (!box) return;
    box.innerHTML = '';
    MAINS_PROMPTS.forEach(p => {
      const el = document.createElement('div');
      el.className = 'focus-card p-2 cursor-pointer hover:bg-slate-800/50 border border-transparent hover:border-cyan-400/50 transition ' + (mainsState.currentId === p.id ? 'border-cyan-400 bg-cyan-950/20' : '');
      el.innerHTML = `<div class="text-xs font-bold text-slate-200">${p.gs}</div><div class="text-[10px] text-slate-400 truncate">${escapeHtml(p.prompt)}</div><div class="text-[9px] text-slate-500 mt-0.5">${p.words} words</div>`;
      el.addEventListener('click', () => {
        mainsState.currentId = p.id;
        mainsState.timeLeft = 25 * 60;
        mainsState.running = false;
        if (mainsState.interval) clearInterval(mainsState.interval);
        mainsState.interval = null;
        renderMainsPrompts();
        renderMainsEditor();
        updateMainsUI();
      });
      box.appendChild(el);
    });
  }

  function renderMainsEditor() {
    const prompt = MAINS_PROMPTS.find(p => p.id === mainsState.currentId);
    const title = document.getElementById('mains-current-prompt');
    const ta = document.getElementById('mains-answer');
    const wc = document.getElementById('mains-wordcount');
    const gt = document.getElementById('mains-gs-tag');
    if (!prompt) return;
    if (title) title.textContent = `${prompt.gs} — ${prompt.prompt}`;
    if (gt) gt.textContent = `GS Paper: ${prompt.gs} • Target ~${prompt.words} words`;
    const saved = state.mainsAnswers.find(a => a.promptId === prompt.id);
    if (ta) ta.value = saved ? saved.answer : '';
    if (wc) wc.textContent = `Words: ${(ta ? ta.value : '').split(/\s+/).filter(Boolean).length}`;
  }

  function updateMainsUI() {
    const t = document.getElementById('mains-timer');
    if (!t) return;
    const m = Math.floor(mainsState.timeLeft / 60);
    const s = mainsState.timeLeft % 60;
    t.textContent = `Time: ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    document.getElementById('mains-start-timer').textContent = mainsState.running ? '<i class="fa-solid fa-pause"></i> Pause' : '<i class="fa-solid fa-play"></i> Resume';
  }

  function startMainsTimer() {
    if (mainsState.running) return;
    mainsState.running = true;
    mainsState.interval = setInterval(() => {
      mainsState.timeLeft--;
      updateMainsUI();
      saveState();
      if (mainsState.timeLeft <= 0) {
        clearInterval(mainsState.interval);
        mainsState.interval = null;
        mainsState.running = false;
        updateMainsUI();
        showToast('Time up! Save your answer.', 'info');
      }
    }, 1000);
    updateMainsUI();
  }

  function pauseMainsTimer() {
    mainsState.running = false;
    if (mainsState.interval) clearInterval(mainsState.interval);
    mainsState.interval = null;
    updateMainsUI();
  }

  function resetMainsTimer() {
    pauseMainsTimer();
    mainsState.timeLeft = 25 * 60;
    updateMainsUI();
  }

  function saveMainsAnswer() {
    const prompt = MAINS_PROMPTS.find(p => p.id === mainsState.currentId);
    if (!prompt) return;
    const ta = document.getElementById('mains-answer');
    const answer = ta ? ta.value.trim() : '';
    if (!answer) { showToast('Write something before saving.', 'info'); return; }
    const words = answer.split(/\s+/).filter(Boolean).length;
    const existing = state.mainsAnswers.findIndex(a => a.promptId === prompt.id);
    const entry = { id: 'm-' + Date.now(), promptId: prompt.id, prompt: prompt.prompt, gs: prompt.gs, answer, words, at: Date.now() };
    if (existing >= 0) state.mainsAnswers[existing] = entry;
    else state.mainsAnswers.push(entry);
    saveState();
    renderMainsSaved();
    addXP(10, 'Mains Answer', prompt.gs);
    showToast('Answer saved.', 'success');
  }

  function renderMainsSaved() {
    const list = document.getElementById('mains-saved-list');
    if (!list) return;
    list.innerHTML = '';
    if (!state.mainsAnswers.length) { list.innerHTML = '<div class="text-xs text-slate-500 italic">No saved answers yet.</div>'; return; }
    state.mainsAnswers.slice().reverse().forEach(a => {
      const el = document.createElement('div');
      el.className = 'focus-card p-2';
      el.innerHTML = `<div class="text-xs font-bold text-cyan-300 mb-0.5">${a.gs}</div><div class="text-[10px] text-slate-300 leading-relaxed mb-1">${escapeHtml(a.prompt)}</div><div class="text-[9px] text-slate-500">${a.words} words • ${new Date(a.at).toLocaleString()}</div>`;
      list.appendChild(el);
    });
  }

  /* =========================================================================
   * FEATURE 4: SPACED-REPETITION FLASHCARDS (SM-2 simplified)
   * ========================================================================= */
  function initFlashcards() {
    if (!state.flashcards.length) {
      state.flashcards = DATA.FLASHCARDS_SEED.map((c, i) => ({
        id: 'fc-' + i, q: c.q, a: c.a, subject: c.subject,
        interval: 0, repeat: 0, ease: 2.5, due: Date.now(), lastReview: null
      }));
      saveState();
    }
  }

  function fcDueCount() {
    const now = Date.now();
    return state.flashcards.filter(c => c.due <= now).length;
  }

  function renderFlashcardsUI() {
    document.getElementById('fc-due-count').textContent = fcDueCount();
    document.getElementById('fc-total-count').textContent = state.flashcards.length;
    document.getElementById('fc-mastered-count').textContent = state.flashcards.filter(c => c.interval >= 30).length;
  }

  let fcCurrent = null;

  function studyFlashcards() {
    initFlashcards();
    const due = state.flashcards.filter(c => c.due <= Date.now());
    if (!due.length) {
      document.getElementById('fc-card-container').innerHTML = '<div class="text-center text-emerald-400 text-xs font-bold">No cards due today. Great job!</div>';
      document.getElementById('fc-rating').classList.add('hidden');
      document.getElementById('fc-progress').textContent = '0 / 0';
      fcCurrent = null;
      return;
    }
    fcCurrent = due[0];
    renderFCCard();
  }

  function renderFCCard(showAnswer = false) {
    const box = document.getElementById('fc-card-container');
    const rating = document.getElementById('fc-rating');
    if (!fcCurrent) return;
    box.innerHTML = `
      <div class="focus-card p-6 rounded-2xl text-center min-h-[300px] flex flex-col justify-center border-2 border-cyan-400/40">
        <div class="text-[10px] font-bold text-slate-400 uppercase mb-2">${escapeHtml(fcCurrent.subject)}</div>
        <div class="text-lg leading-relaxed text-slate-100 font-medium mb-6">${showAnswer ? 'Q: ' : ''}${escapeHtml(fcCurrent.q)}</div>
        ${showAnswer ? `<div class="text-sm text-emerald-300 mt-4 border-t border-slate-700 pt-4">A: ${escapeHtml(fcCurrent.a)}</div>` : ''}
      </div>
    `;
    if (showAnswer) {
      rating.classList.remove('hidden');
      document.getElementById('fc-progress').textContent = 'Reviewing…';
    } else {
      rating.classList.add('hidden');
    }
  }

  function rateFlashcard(rating) {
    if (!fcCurrent) return;
    const now = Date.now();
    let { interval, repeat, ease } = fcCurrent;
    if (rating >= 3) {
      repeat += 1;
      interval = repeat === 1 ? 1 : repeat === 2 ? 6 : Math.round(interval * ease);
      ease = Math.min(ease + 0.1, 3.0);
    } else {
      repeat = 0; interval = 1; ease = Math.max(ease - 0.2, 1.3);
    }
    fcCurrent.interval = interval;
    fcCurrent.repeat = repeat;
    fcCurrent.ease = ease;
    fcCurrent.due = now + interval * 86400000;
    fcCurrent.lastReview = now;
    saveState();
    // move to next due card
    const due = state.flashcards.filter(c => c.id !== fcCurrent.id && c.due <= Date.now());
    fcCurrent = due[0] || null;
    renderFlashcardsUI();
    if (fcCurrent) { renderFCCard(false); document.getElementById('fc-rating').classList.add('hidden'); }
    else {
      document.getElementById('fc-card-container').innerHTML = '<div class="text-center text-emerald-400 text-xs font-bold">All due cards reviewed!</div>';
      document.getElementById('fc-rating').classList.add('hidden');
      document.getElementById('fc-progress').textContent = 'Complete';
    }
  }

  /* =========================================================================
   * FEATURE 5: READER HIGHLIGHTS
   * ========================================================================= */
  let currentSelectionRange = null;

  function saveHighlight(text, note) {
    if (!currentReaderBook || !text.trim()) return;
    state.highlights.push({ bookId: currentReaderBook.id, page: readerPageIdx + 1, text: text.trim(), note: note || '', at: Date.now() });
    saveState();
    renderHighlights();
    showToast('Highlight saved.', 'success');
  }

  function renderHighlights() {
    const list = document.getElementById('highlights-list');
    if (!list) return;
    list.innerHTML = '';
    const hs = state.highlights.filter(h => currentReaderBook ? h.bookId === currentReaderBook.id : true);
    if (!hs.length) { list.innerHTML = '<div class="text-center py-6 text-slate-500 text-xs italic">No highlights yet. Select text while reading to save.</div>'; return; }
    hs.slice().reverse().forEach(h => {
      const book = state.bookshelf.find(b => b.id === h.bookId);
      const el = document.createElement('div');
      el.className = 'focus-card p-3';
      el.innerHTML = `
        <div class="flex justify-between items-start mb-1">
          <span class="text-[10px] font-bold text-cyan-300">${book ? escapeHtml(book.title) : 'Book'}</span>
          <span class="text-[10px] text-slate-500">Page ${h.page}</span>
        </div>
        <div class="text-xs text-slate-300 leading-relaxed mb-1 italic">"${escapeHtml(h.text)}"</div>
        ${h.note ? `<div class="text-xs text-slate-400 mb-2">Note: ${escapeHtml(h.note)}</div>` : ''}
        <div class="text-[9px] text-slate-500">${new Date(h.at).toLocaleString()}</div>
      `;
      list.appendChild(el);
    });
  }

  /* Highlight text on reader page (mouseup) */
  function initReaderHighlight() {
    const surface = document.getElementById('reader-scroll-surface');
    if (!surface) return;
    surface.addEventListener('mouseup', () => {
      const sel = window.getSelection();
      const txt = sel.toString().trim();
      if (!txt || txt.length < 5 || txt.length > 300) return;
      currentSelectionRange = sel.getRangeAt(0);
      // Prompt for note
      const note = prompt('Add a note for this highlight (optional):');
      saveHighlight(txt, note || '');
      sel.removeAllRanges();
    });
  }

  /* =========================================================================
   * FEATURE 6: ANALYTICS (Chart.js)
   * ========================================================================= */
  function renderAnalytics() {
    const weakBox = document.getElementById('analytics-weak-areas');
    if (weakBox) {
      weakBox.innerHTML = '';
      const subjects = Object.keys(DATA.KNOWLEDGE_MATRICES);
      // Weak = subjects with books equipped but low/no quiz activity — simple heuristic: lowest subjectXP
      const entries = Object.entries(state.subjectXP || {}).sort((a, b) => a[1] - b[1]);
      if (!entries.length) {
        weakBox.innerHTML = '<div class="text-xs text-slate-500 italic">Study some books or attempt quizzes to see analytics.</div>';
      } else {
        entries.slice(0, 4).forEach(([sub, xp]) => {
          const el = document.createElement('div');
          el.className = 'focus-card p-3';
          el.innerHTML = `<div class="text-xs font-bold text-slate-200">${escapeHtml(sub)}</div><div class="text-[10px] text-slate-400">XP: ${xp} — Focus on ${sub} revision.</div>`;
          weakBox.appendChild(el);
        });
      }
    }

    // XP by Subject chart
    const cxp = document.getElementById('chart-xp-subject');
    if (cxp && window.Chart) {
      new window.Chart(cxp.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(state.subjectXP || {}),
          datasets: [{ data: Object.values(state.subjectXP || {}), backgroundColor: ['#14b8a6','#4338ca','#d97706','#10b981','#e11d48','#a855f7','#38bdf8'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 } } }, title: { display: true, text: 'XP by Subject', color: '#cbd5e1', font: { size: 12 } } } }
      });
    }
    // Books per Subject chart
    const cbook = document.getElementById('chart-books-subject');
    if (cbook && window.Chart) {
      const counts = {};
      state.bookshelf.forEach(b => counts[b.subject] = (counts[b.subject] || 0) + 1);
      new window.Chart(cbook.getContext('2d'), {
        type: 'bar',
        data: {
          labels: Object.keys(counts),
          datasets: [{ label: 'Books', data: Object.values(counts), backgroundColor: '#14b8a6' }]
        },
        options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: 'Equipped Books by Subject', color: '#cbd5e1', font: { size: 12 } } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: '#1e293b' } }, x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } } } }
      });
    }
  }

  /* =========================================================================
   * FEATURE 7: EXAM DAY SIMULATOR
   * ========================================================================= */
  let examState = { questions: [], index: 0, answers: {}, marks: 0, timeLeft: 0, running: false, interval: null, submitted: false };

  function startExam() {
    const len = parseInt(document.getElementById('exam-length').value, 10);
    // Use procedural questions + static mix for the exam
    const qs = [];
    for (let i = 0; i < len; i++) qs.push(DATA.generateProceduralQuestion('ALL', state.bookTexts));
    examState.questions = qs;
    examState.index = 0;
    examState.answers = {};
    examState.marks = 0;
    examState.timeLeft = len === 100 ? 120 * 60 : (len === 50 ? 60 * 60 : 30 * 60);
    examState.running = true;
    examState.submitted = false;
    examState.interval = setInterval(() => {
      examState.timeLeft--;
      document.getElementById('exam-timer').textContent = fmtTime(examState.timeLeft);
      saveState();
      if (examState.timeLeft <= 0) submitExam();
    }, 1000);
    document.getElementById('exam-question-card').classList.remove('hidden');
    document.getElementById('exam-summary').classList.add('hidden');
    document.getElementById('exam-submit').classList.add('hidden');
    document.getElementById('exam-start').classList.add('hidden');
    document.getElementById('exam-status').textContent = 'Exam in progress…';
    renderExamQuestion();
  }

  function renderExamQuestion() {
    if (examState.submitted) return;
    const q = examState.questions[examState.index];
    document.getElementById('exam-qnum').textContent = `Q${examState.index + 1}`;
    document.getElementById('exam-prompt').textContent = q.prompt;
    const box = document.getElementById('exam-options');
    box.innerHTML = '';
    q.options.forEach((opt, i) => {
      const selected = examState.answers[examState.index] === i;
      const el = document.createElement('div');
      el.className = 'focus-card p-3 cursor-pointer ' + (selected ? 'border-2 border-cyan-400 bg-cyan-950/30' : 'hover:bg-slate-800/50 transition');
      el.innerHTML = `<div class="flex items-center gap-3"><span class="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center text-[10px] ${selected ? 'border-cyan-400 text-cyan-300' : 'text-slate-500'}">${String.fromCharCode(65+i)}</span><span class="text-sm text-slate-200 whitespace-pre-line">${escapeHtml(opt)}</span></div>`;
      el.addEventListener('click', () => { examState.answers[examState.index] = i; renderExamQuestion(); });
      box.appendChild(el);
    });
    document.getElementById('exam-prev').disabled = examState.index === 0;
    document.getElementById('exam-next').classList.toggle('hidden', examState.index + 1 >= examState.questions.length);
    document.getElementById('exam-submit').classList.toggle('hidden', examState.index + 1 < examState.questions.length);
  }

  function submitExam() {
    if (examState.interval) clearInterval(examState.interval);
    examState.interval = null;
    examState.running = false;
    examState.submitted = true;
    let correct = 0, marks = 0;
    examState.questions.forEach((q, i) => {
      const ans = examState.answers[i];
      if (ans === undefined) return;
      if (ans === q.answer) { correct++; marks += 2; }
      else marks -= 0.66;
    });
    examState.marks = marks;
    const pct = examState.questions.length ? Math.round((correct / examState.questions.length) * 100) : 0;
    // Goal progress: quiz questions
    const wk = getWeekKey(new Date());
    state.goalsProgress = state.goalsProgress || {};
    state.goalsProgress[wk] = state.goalsProgress[wk] || { books: 0, quiz: 0, mains: 0 };
    state.goalsProgress[wk].quiz = (state.goalsProgress[wk].quiz || 0) + examState.questions.length;
    saveState();
    document.getElementById('exam-question-card').classList.add('hidden');
    document.getElementById('exam-summary').classList.remove('hidden');
    document.getElementById('exam-summary').innerHTML = `
      <h3 class="text-xs font-bold text-amber-300 mb-1">EXAM COMPLETE</h3>
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="p-3 rounded-lg bg-slate-900 border border-cyan-400/30 text-center"><div class="text-[10px] text-slate-400">Marks</div><div class="font-arcade text-xs text-cyan-300">${marks.toFixed(2)} / ${examState.questions.length * 2}</div></div>
        <div class="p-3 rounded-lg bg-slate-900 border border-amber-400/30 text-center"><div class="text-[10px] text-slate-400">Accuracy</div><div class="font-arcade text-xs text-amber-300">${pct}%</div></div>
        <div class="p-3 rounded-lg bg-slate-900 border border-emerald-300/30 text-center"><div class="text-[10px] text-slate-400">Correct</div><div class="font-arcade text-xs text-emerald-300">${correct}/${examState.questions.length}</div></div>
      </div>
      <div class="text-xs text-slate-300 mb-3">${marks >= examState.questions.length * 1.2 ? 'Strong prelims trajectory!' : 'Revise weak subjects in the Quiz Dungeon.'}</div>
      <button id="exam-restart" class="focus-btn focus-btn-accent w-full py-2.5 text-xs"><i class="fa-solid fa-rotate"></i> New Exam</button>
    `;
    document.getElementById('exam-restart').addEventListener('click', () => {
      document.getElementById('exam-summary').classList.add('hidden');
      document.getElementById('exam-start').classList.remove('hidden');
      document.getElementById('exam-status').textContent = 'Ready';
    });
  }

  /* =========================================================================
   * FEATURE 8: GOAL TRACKER
   * ========================================================================= */
  function renderGoalTracker() {
    const prelims = new Date(state.prelimsDate);
    const now = new Date();
    const days = Math.max(0, Math.ceil((prelims - now) / (1000 * 60 * 60 * 24)));
    const weeks = Math.max(0, Math.ceil(days / 7));
    const dEl = document.getElementById('goal-days');
    const wEl = document.getElementById('goal-weeks');
    const xpEl = document.getElementById('goal-xp-target');
    if (dEl) dEl.textContent = days;
    if (wEl) wEl.textContent = weeks;

    // XP this week
    const weekKey = getWeekKey(now);
    const prog = state.goalsProgress && state.goalsProgress[weekKey];
    let weekXP = 0;
    // Approximate: use quests done this week + quiz solved as proxy; simple
    if (xpEl) xpEl.textContent = prog ? prog.xp || 0 : 0;

    const gp = document.getElementById('goal-progress');
    if (gp) {
      gp.innerHTML = '';
      const rows = [
        { label: 'Books completed', val: prog && prog.books !== undefined ? prog.books : 0, target: state.goals.books },
        { label: 'Quiz questions', val: prog && prog.quiz !== undefined ? prog.quiz : 0, target: state.goals.quiz },
        { label: 'Mains answers', val: prog && prog.mains !== undefined ? prog.mains : 0, target: state.goals.mains }
      ];
      rows.forEach(r => {
        const pct = Math.min(100, Math.round((r.val / r.target) * 100));
        const el = document.createElement('div');
        el.className = 'space-y-1 mb-3';
        el.innerHTML = `
          <div class="flex justify-between text-xs"><span class="text-slate-300">${r.label}</span><span class="text-slate-500">${r.val} / ${r.target}</span></div>
          <div class="w-full bg-slate-800 h-1.5 rounded overflow-hidden"><div class="bg-cyan-500 h-full" style="width:${pct}%"></div></div>
        `;
        gp.appendChild(el);
      });
    }
  }

  function getWeekKey(d) {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return start.toISOString().slice(0, 10);
  }

  /* =========================================================================
   * FEATURE 9/10: TTS IMPROVEMENTS (sentence highlight + speed)
   * ========================================================================= */
  let ttsUtterance = null;

  function speakReaderPage() {
    if (!readerPages.length) return;
    if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); ttsUtterance = null; return; }
    const text = readerPages[readerPageIdx].replace(/<[^>]*>/g, '');
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    let idx = 0;
    const speakNext = () => {
      if (idx >= sentences.length) { ttsUtterance = null; return; }
      ttsUtterance = new SpeechSynthesisUtterance(sentences[idx]);
      ttsUtterance.rate = state.ttsSpeed || 1;
      ttsUtterance.onend = () => { idx++; speakNext(); };
      window.speechSynthesis.speak(ttsUtterance);
      // Highlight sentence visually
      if (state.ttsHighlight) highlightReaderSentence(sentences[idx]);
    };
    speakNext();
    showToast('Reading page aloud', 'info');
  }

  function highlightReaderSentence(sentence) {
    const prose = document.getElementById('reader-prose-content');
    if (!prose) return;
    // Remove previous highlight
    prose.querySelectorAll('.tts-highlight').forEach(el => el.classList.remove('tts-highlight'));
    const html = prose.innerHTML;
    const idx = html.indexOf(escapeRegExp(sentence));
    if (idx >= 0) {
      // Simple: wrap in mark via innerHTML replace (could affect tags, acceptable for demo)
      const before = html.slice(0, idx);
      const after = html.slice(idx + sentence.length);
      prose.innerHTML = before + `<mark class="tts-highlight bg-amber-400/30 rounded px-1">${escapeHtml(sentence)}</mark>` + after;
      prose.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    }

  function bindUI() {
    bindNav();

    // --- Shelf controls ---
    const btnStarter = document.getElementById('btn-equip-starter');
    const starters = DATA.UPSC_BOOK_VAULT.filter(b => b.starter);
    if (btnStarter) btnStarter.textContent = `Starter Pack (${starters.length})`;
    if (btnStarter) btnStarter.addEventListener('click', equipStarterPack);
    const btnAll = document.getElementById('btn-equip-all-upsc');
    if (btnAll) btnAll.addEventListener('click', equipAllVault);
    const btnJump = document.getElementById('btn-jump-grabber');
    if (btnJump) btnJump.addEventListener('click', () => showTab('grabber'));
    const btnBanner = document.getElementById('btn-banner-arena');
    if (btnBanner) btnBanner.addEventListener('click', () => showTab('arena'));

    // Shelf filters
    document.getElementById('shelf-filter-bar').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-shelf-filter]');
      if (!btn) return;
      document.querySelectorAll('[data-shelf-filter]').forEach(b => {
        b.classList.remove('bg-cyan-400', 'text-slate-950');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      btn.classList.add('bg-cyan-400', 'text-slate-950');
      currentShelfFilter = btn.dataset.shelfFilter;
      renderBookshelf(currentShelfFilter);
    });

    // --- Book grabber ---
    const form = document.getElementById('ol-search-form');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('ol-search-input').value.trim();
      if (!q) return;
      searchOpenLibrary(q);
    });
    document.getElementById('ol-search-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); form.dispatchEvent(new Event('submit')); } });
    document.querySelectorAll('.quick-ol-chip').forEach(ch => {
      ch.addEventListener('click', () => {
        document.getElementById('ol-search-input').value = ch.dataset.quickQuery;
        form.dispatchEvent(new Event('submit'));
      });
    });

    // Local book import
    const up = document.getElementById('local-book-upload');
    if (up) up.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'epub') {
        const url = URL.createObjectURL(file);
        addToShelf({
          id: `local-${Date.now()}`,
          title: file.name.replace(/\.epub$/i, ''),
          author: 'Local Import',
          pages: 0,
          subject: 'Misc',
          gsPaper: 'Misc',
          localEpubUrl: url,
          spineColor: spineColorFor({}),
          accentColor: '#94a3b8',
          rarity: 'Common',
          syllabus: 'Locally imported EPUB — open via Downloads mode in reader',
          progress: 0,
          bookmarkedPage: 1,
          addedAt: Date.now()
        });
        showToast(`EPUB imported: ${file.name}`, 'success');
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          addToShelf({
            id: `local-${Date.now()}`,
            title: file.name.replace(/\.(txt|md)$/i, ''),
            author: 'Local Import',
            pages: Math.max(50, Math.ceil((ev.target.result || '').length / 250)),
            subject: guessSubject(file.name, ''),
            gsPaper: 'Misc',
            localText: ev.target.result || '',
            spineColor: spineColorFor({}),
            accentColor: '#00f5d4',
            rarity: 'Epic',
            syllabus: 'Locally imported full text',
            progress: 0,
            bookmarkedPage: 1,
            addedAt: Date.now()
          });
          showToast(`Imported full text: ${file.name}`, 'success');
        };
        reader.readAsText(file);
      }
      up.value = '';
    });

    // Vault filter
    const vf = document.getElementById('vault-filter-search');
    let vaultDebounce;
    if (vf) vf.addEventListener('input', (e) => {
      clearTimeout(vaultDebounce);
      vaultDebounce = setTimeout(() => renderVault(currentVaultCat, vf.value), 200);
    });
    document.getElementById('vault-cat-bar').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-vault-cat]');
      if (!btn) return;
      document.querySelectorAll('[data-vault-cat]').forEach(b => {
        b.classList.remove('bg-amber-400', 'text-slate-950');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.remove('bg-slate-800', 'text-slate-300');
      btn.classList.add('bg-amber-400', 'text-slate-950');
      currentVaultCat = btn.dataset.vaultCat;
      renderVault(currentVaultCat, currentVaultSearch);
    });

    // --- Mana timer ---
    document.getElementById('btn-timer-start').addEventListener('click', toggleTimer);
    document.getElementById('btn-timer-reset').addEventListener('click', resetTimer);
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (timerState.running) return;
        document.querySelectorAll('.timer-preset-btn').forEach(b => {
          b.classList.remove('border-cyan-400', 'bg-cyan-950/60', 'text-cyan-200');
          b.classList.add('border-slate-700', 'bg-slate-900', 'text-slate-300');
        });
        btn.classList.remove('border-slate-700', 'bg-slate-900', 'text-slate-300');
        btn.classList.add('border-cyan-400', 'bg-cyan-950/60', 'text-cyan-200');
        setTimerMinutes(parseInt(btn.dataset.minutes, 10));
      });
    });

    // --- Quest board ---
    const qform = document.getElementById('quest-form');
    if (qform) qform.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('quest-input');
      const tag = document.getElementById('quest-tag');
      if (!inp.value.trim()) return;
      state.quests.push({ id: `q-${Date.now()}`, text: inp.value.trim(), tag: tag.value, done: false, createdAt: Date.now() });
      inp.value = '';
      saveState();
      renderQuestBoard();
      renderHUD();
    });
    document.getElementById('btn-seed-quests').addEventListener('click', seedQuests);

    // --- Quiz controls ---
    document.querySelectorAll('.quiz-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        quizState.mode = btn.dataset.quizMode;
        if (quizState.mode === 'mock') {
          document.getElementById('mock-length-select').classList.remove('hidden');
          document.getElementById('btn-new-mock').classList.remove('hidden');
          quizState.totalQ = parseInt(document.getElementById('mock-length-select').value, 10);
        } else {
          document.getElementById('mock-length-select').classList.add('hidden');
          document.getElementById('btn-new-mock').classList.add('hidden');
        }
        renderQuizControls();
        startQuiz();
      });
    });
    document.getElementById('mock-length-select').addEventListener('change', (e) => {
      quizState.totalQ = parseInt(e.target.value, 10);
      if (quizState.mode === 'mock') startQuiz();
    });
    document.getElementById('mock-length-select').addEventListener('change', (e) => {
      quizState.totalQ = parseInt(e.target.value, 10);
    });
    document.getElementById('btn-new-mock').addEventListener('click', startQuiz);
    document.getElementById('btn-next-question').addEventListener('click', () => {
      if (quizState.mode === 'mock' && quizState.qIndex + 1 >= quizState.totalQ) return;
      quizState.qIndex++;
      nextQuizQuestion();
    });
    document.getElementById('btn-5050-lifeline').addEventListener('click', () => {
      if (!state.settings.sfx) {}
      const q = quizState.current;
      if (!q || quizState.answered) return;
      const wrong = q.options.map((_, i) => i).filter(i => i !== q.answer);
      const toRemove = shuffle(wrong).slice(0, 2);
      toRemove.forEach(i => {
        const el = document.querySelector(`[data-opt="${i}"]`);
        if (el) {
          el.classList.add('option-eliminated');
          const eb = el.querySelector('[data-elim]');
          if (eb) eb.style.display = 'none';
        }
      });
      quizState.eliminated = new Set(toRemove);
      document.getElementById('btn-5050-lifeline').disabled = true;
      document.getElementById('btn-5050-lifeline').classList.add('opacity-50');
      playSfx('click');
      showToast('50:50 — two wrong options eliminated', 'info');
    });
    document.getElementById('btn-skip-question').addEventListener('click', () => {
      if (quizState.answered) return;
      quizState.answered = true;
      quizState.solved++;
      state.streak = 0;
      playSfx('click');
      showResultBanner(false, { explanation: 'Skipped — 0 marks awarded.' }, 'Skipped. 0.00 marks.');
      revealExplanation({ explanation: 'You skipped this question to avoid negative marking.' });
      document.getElementById('btn-next-question').classList.remove('hidden');
      updateQuizHUD();
      saveState();
    });
    document.getElementById('btn-bookmark-question').addEventListener('click', () => {
      const q = quizState.current;
      if (!q) return;
      state.savedNotes.push({ bookId: 'Quiz:' + q.subject, text: q.prompt + '\n\n' + q.explanation, at: Date.now() });
      saveState();
      renderSavedNotes();
      showToast('Bookmarked to revision notes', 'success');
    });

    // --- Reader modal ---
    if (readerEls.close) readerEls.close.addEventListener('click', closeReader);
    readerEls.modal.addEventListener('click', (e) => { if (e.target === readerEls.modal) closeReader(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && readerEls.modal && !readerEls.modal.classList.contains('hidden')) closeReader();
    });

    document.querySelectorAll('.reader-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => switchReaderMode(btn.dataset.readerMode));
    });

    if (readerEls.btnPrev) readerEls.btnPrev.addEventListener('click', () => {
      if (readerPageIdx > 0) { readerPageIdx--; renderReaderPage(); }
    });
    if (readerEls.btnNext) readerEls.btnNext.addEventListener('click', () => {
      if (readerPageIdx < readerPages.length - 1) { readerPageIdx++; renderReaderPage(); }
    });
    if (readerEls.pageSlider) readerEls.pageSlider.addEventListener('input', (e) => {
      readerPageIdx = parseInt(e.target.value, 10) - 1;
      renderReaderPage();
    });

    // Reader formatting
    document.querySelectorAll('.rtheme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        readerTheme = btn.dataset.rtheme;
        document.querySelectorAll('.rtheme-btn').forEach(b => {
          b.classList.remove('border-cyan-400', 'bg-[#0b1021]', 'text-cyan-200');
        });
        btn.classList.add('border-cyan-400', 'bg-[#0b1021]', 'text-cyan-200');
        updateReaderTheme();
      });
    });
    document.getElementById('btn-font-dec').addEventListener('click', () => { readerFontPx = Math.max(14, readerFontPx - 2); updateReaderFont(); });
    document.getElementById('btn-font-inc').addEventListener('click', () => { readerFontPx = Math.min(32, readerFontPx + 2); updateReaderFont(); });

    // TTS
    let ttsPlaying = false;
    document.getElementById('btn-tts-toggle').addEventListener('click', () => {
      if (!readerPages.length) return;
      speakReaderPage();
    });
    document.getElementById('tts-speed-select').addEventListener('change', (e) => {
      state.ttsSpeed = parseFloat(e.target.value);
      saveState();
      if (window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); speakReaderPage(); }
    });

    document.getElementById('btn-bookmark-page').addEventListener('click', () => {
      if (!currentReaderBook) return;
      const shelfItem = state.bookshelf.find(b => b.id === currentReaderBook.id);
      if (!shelfItem) { showToast('Equip this book to bookmark pages', 'info'); return; }
      shelfItem.bookmarkedPage = readerPageIdx + 1;
      saveState();
      showToast(`Bookmark saved at Page ${readerPageIdx + 1}`, 'success');
    });

    // Reader search
    document.getElementById('btn-reader-search').addEventListener('click', () => {
      readerSearchTerm = document.getElementById('reader-search-input').value.trim().toLowerCase();
      if (!readerSearchTerm) { readerEls.searchHits.classList.add('hidden'); renderReaderPage(); return; }
      const hits = readerPages.reduce((acc, p, i) => {
        if (p.toLowerCase().includes(readerSearchTerm)) acc.push(i + 1);
        return acc;
      }, []);
      readerEls.searchHits.classList.remove('hidden');
      readerEls.searchHits.textContent = hits.length ? `Matches on pages: ${hits.slice(0, 8).join(', ')}` + (hits.length > 8 ? '…' : '') : 'No matches';
      renderReaderPage();
    });

    // Notes drawer
    document.getElementById('btn-toggle-reader-notes').addEventListener('click', () => {
      readerEls.notesDrawer.classList.toggle('hidden');
    });
    document.getElementById('btn-close-notes-drawer').addEventListener('click', () => {
      readerEls.notesDrawer.classList.add('hidden');
    });
    document.getElementById('btn-save-book-note').addEventListener('click', () => {
      if (!currentReaderBook) return;
      const text = readerEls.notesTextarea.value.trim();
      if (!text) return;
      let note = state.savedNotes.find(n => n.bookId === currentReaderBook.id);
      if (note) { note.text = text; note.at = Date.now(); note.page = readerPageIdx + 1; }
      else { state.savedNotes.push({ bookId: currentReaderBook.id, text, page: readerPageIdx + 1, at: Date.now() }); }
      saveState();
      renderSavedNotes();
      addXP(10, 'Book Note');
      showToast('Note saved (+10 XP)', 'success');
    });

    document.getElementById('btn-quiz-this-book').addEventListener('click', () => {
      if (!currentReaderBook) return;
      const bt = state.bookTexts.find(b => b.sourceId === (currentReaderBook.iaId || currentReaderBook.id));
      if (!bt) {
        showToast('Loading full text for quiz generation…', 'info');
        loadReaderBookText(currentReaderBook).then(t => {
          state.bookTexts.push({ sourceId: currentReaderBook.iaId || currentReaderBook.id, title: currentReaderBook.title, text: t });
          saveState();
          closeReader();
          showTab('arena');
          quizState.mode = 'book';
          quizState.subject = currentReaderBook.subject || 'ALL';
          renderQuizControls();
          startQuiz();
        }).catch(() => showToast('Full text not available for quiz generation', 'error'));
        return;
      }
      closeReader();
      showTab('arena');
      quizState.mode = 'book';
      quizState.subject = currentReaderBook.subject || 'ALL';
      renderQuizControls();
      startQuiz();
    });

    // Fullscreen reader toggle
    if (readerEls.btnFullscreen) {
      readerEls.btnFullscreen.addEventListener('click', toggleReaderFullscreen);
    }

    // Open book in new tab (best for reading & notes)
    if (readerEls.btnNewTab) {
      readerEls.btnNewTab.addEventListener('click', () => {
        if (!currentReaderBook) return;
        openReaderBookInNewTab(currentReaderBook);
      });
    }

    // Handle native fullscreen exit (Esc key or browser UI)
    document.addEventListener('fullscreenchange', () => {
      if (!readerEls.modal) return;
      const isFs = !!document.fullscreenElement;
      readerEls.modal.classList.toggle('reader-fullscreen', isFs);
      updateReaderFullscreenUI(isFs);
    });

    // --- Hero tab controls ---
    document.getElementById('btn-export-save').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `lbsnaa_quest_save_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Save exported', 'success');
    });
    document.getElementById('input-import-save').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imp = JSON.parse(ev.target.result);
          state = { ...DEFAULTS, ...imp, settings: { ...DEFAULTS.settings, ...(imp.settings || {}) } };
          saveState();
          renderHUD(); renderBookshelf(currentShelfFilter); renderQuestBoard();
          renderAvatarSelector(); renderBadgesVault(); renderHeroStats(); renderSavedNotes();
          applySettings();
          showToast('Save imported successfully', 'success');
        } catch (err) { showToast('Invalid save file', 'error'); }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
    document.getElementById('btn-reset-save').addEventListener('click', () => {
      if (!confirm('Reset all RPG progress? This cannot be undone.')) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    // --- Settings toggles ---
    document.getElementById('btn-toggle-sfx').addEventListener('click', () => {
      state.settings.sfx = !state.settings.sfx;
      saveState();
      showToast(state.settings.sfx ? 'SFX ON' : 'SFX OFF', 'info');
    });
    document.getElementById('btn-toggle-crt').addEventListener('click', () => {
      state.settings.crt = !state.settings.crt;
      saveState();
      applySettings();
      showToast(state.settings.crt ? 'CRT scanlines ON' : 'CRT scanlines OFF', 'info');
    });
    document.getElementById('btn-open-profile').addEventListener('click', () => showTab('hero'));
    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      const theme = isLight ? 'light' : 'dark';
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('lbsnaa_theme', theme);
      state.settings.theme = theme;
      saveState();
    const icon = document.querySelector('#btn-toggle-theme i');
    if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    showToast(theme === 'light' ? 'Light Mode' : 'Dark Mode', 'info');
  });

  /* =========================================================================
   * PWA INSTALL PROMPT
   * ========================================================================= */
  let deferredPrompt = null;
  const pwaBanner = document.getElementById('pwa-install-banner');
  const pwaInstallBtn = document.getElementById('btn-pwa-install');
  const pwaDismissBtn = document.getElementById('btn-pwa-dismiss');

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show our custom install banner
    if (pwaBanner) pwaBanner.classList.remove('hidden');
    // Auto-dismiss after 10 seconds if not interacted with
    setTimeout(() => {
      if (pwaBanner && !pwaBanner.classList.contains('hidden')) {
        pwaBanner.classList.add('hidden');
      }
    }, 10000);
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('App installed!', 'success');
      } else {
        showToast('Install dismissed', 'info');
      }
      deferredPrompt = null;
      if (pwaBanner) pwaBanner.classList.add('hidden');
    });
  }

  if (pwaDismissBtn) {
    pwaDismissBtn.addEventListener('click', () => {
      if (pwaBanner) pwaBanner.classList.add('hidden');
    });
  }

  // Hide banner if app is already running standalone (installed)
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    if (pwaBanner) pwaBanner.style.display = 'none';
  }

    // --- Feature 1: Current Affairs ---
    document.getElementById('btn-ca-refresh').addEventListener('click', renderCA);

    // --- Feature 2: PYQ Bank ---
    document.getElementById('pyq-subject').addEventListener('change', renderPYQ);
    document.getElementById('pyq-year').addEventListener('change', renderPYQ);

    // --- Feature 3: Mains Answer Writing ---
    document.getElementById('mains-start-timer').addEventListener('click', () => {
      if (!mainsState.currentId) { showToast('Select a prompt first.', 'info'); return; }
      if (mainsState.running) pauseMainsTimer(); else startMainsTimer();
    });
    document.getElementById('mains-pause-timer').addEventListener('click', pauseMainsTimer);
    document.getElementById('mains-reset-timer').addEventListener('click', resetMainsTimer);
    document.getElementById('mains-save').addEventListener('click', saveMainsAnswer);
    document.getElementById('mains-answer').addEventListener('input', (e) => {
      document.getElementById('mains-wordcount').textContent = `Words: ${e.target.value.split(/\s+/).filter(Boolean).length}`;
    });

    // --- Feature 4: Flashcards ---
    document.getElementById('fc-study').addEventListener('click', () => { studyFlashcards(); renderFCCard(false); });
    document.getElementById('fc-rating').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-rating]');
      if (btn) rateFlashcard(parseInt(btn.dataset.rating, 10));
    });

    // --- Feature 5: Reader Highlights + Fullscreen ---
    if (readerEls.btnFullscreen) readerEls.btnFullscreen.addEventListener('click', toggleReaderFullscreen);
    document.addEventListener('fullscreenchange', () => {
      const isFs = !!document.fullscreenElement;
      readerEls.modal.classList.toggle('reader-fullscreen', isFs);
      updateReaderFullscreenUI(isFs);
    });
    // Init highlight on reader page load
    const origOpenReader = openReader;
    openReader = function(book) {
      origOpenReader(book);
      setTimeout(initReaderHighlight, 500);
    };

    // --- Feature 6: Exam Simulator ---
    document.getElementById('exam-start').addEventListener('click', startExam);
    document.getElementById('exam-prev').addEventListener('click', () => {
      if (examState.index > 0) { examState.index--; renderExamQuestion(); }
    });
    document.getElementById('exam-next').addEventListener('click', () => {
      if (examState.index + 1 < examState.questions.length) { examState.index++; renderExamQuestion(); }
    });

    // --- Feature 8: Goal Tracker ---
    document.getElementById('goal-save').addEventListener('click', () => {
      state.goals.books = parseInt(document.getElementById('goal-books').value, 10) || 0;
      state.goals.quiz = parseInt(document.getElementById('goal-quiz').value, 10) || 0;
      state.goals.mains = parseInt(document.getElementById('goal-mains').value, 10) || 0;
      saveState();
      renderGoalTracker();
      showToast('Targets saved.', 'success');
    });

    // Hash-based tab navigation
    window.addEventListener('hashchange', () => checkTabFromHash());
  }

  function checkTabFromHash() {
    const h = location.hash.replace('#', '');
    const valid = ['sanctum', 'grabber', 'arena', 'ca', 'pyq', 'mains', 'flashcards', 'highlights', 'analytics', 'exam', 'goal', 'hero'];
    if (h && valid.includes(h)) showTab(h);
  }

  function applySettings() {
    if (state.settings.crt) document.body.classList.add('crt-enabled');
    else document.body.classList.remove('crt-enabled');

    // Theme: light / dark
    const savedTheme = localStorage.getItem('lbsnaa_theme');
    let prefersDark = true;
    try { prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) {}
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    if (isDark) {
      document.body.classList.remove('light-mode');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.setAttribute('data-theme', 'light');
    }
    const btn = document.getElementById('btn-toggle-theme');
    const icon = btn && btn.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
  }

  /* =========================================================================
   * UTILITIES
   * ========================================================================= */
  function escapeHtml(s) {
    if (s == null) return '';
    const d = document.createElement('div');
    d.textContent = String(s);
    return d.innerHTML;
  }

  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function shuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // Expose for debugging
  window.__LBSNAA = {
    state,
    addXP,
    renderBookshelf,
    showTab,
    startQuiz,
    nextQuizQuestion,
    handleQuizAnswer,
    completeQuest,
    toggleTimer,
    openReader,
    closeReader,
    searchOpenLibrary,
    seedQuests,
    addToShelf,
    equipStarterPack,
    equipAllVault,
    renderVault,
    renderBadgesVault,
    renderCA,
    renderPYQ,
    renderMainsPrompts,
    renderMainsEditor,
    renderMainsSaved,
    initFlashcards,
    studyFlashcards,
    saveHighlight,
    renderHighlights,
    renderAnalytics,
    startExam,
    renderGoalTracker,
    renderFlashcardsUI,
    submitExam
  };

  /* =========================================================================
   * BOOT
   * ========================================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    renderHUD();
    renderBookshelf(currentShelfFilter);
    renderVault(currentVaultCat, currentVaultSearch);
    renderBadgesVault();
    renderAvatarSelector();
    renderHeroStats();
    renderQuestBoard();
    renderSavedNotes();
    initFlashcards();
    renderFlashcardsUI();
    renderGoalTracker();
    applySettings();
    bindUI();
    checkTabFromHash();
  });
})();
