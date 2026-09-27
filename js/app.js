(function () {
  const $ = s => document.querySelector(s);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  const PRAISE = ['יופי! 👏', 'אלוף! 🏆', 'וואו! 🤩', 'בול! 🎯', 'כל הכבוד! 🌟', 'מושלם! ✨', 'איזה מוח! 🧠',
    'טיל! 🚀', 'גאון! 🤓', 'נכון מאוד! ✅', 'אש! 🔥', 'מדהים! 🦄', 'יש! 💪', 'סחתיין! 😎'];
  const OOPS = ['אופס! 🙈', 'כמעט! 🤏', 'הממ... לא בדיוק 🤔', 'הספרה הזאת התחפשה 🥸', 'אוי, החלקתי על בננה 🍌', 'נסה שוב, אתה יכול! 💪'];
  const WIN = ['פתרת! 🥳', 'אלוף העולם! 🌍', 'מלך הנקודה! 👑', 'איזה תותח! 💥', 'סיימת בענק! 🐘'];

  const all = [];
  PAGES.forEach(page => page.questions.forEach(q => all.push({ page, q })));

  let currentIdx = -1, game = null, streak = 0;

  // ---------- sound ----------
  const Sound = {
    on: Store.pref('sound', true), ctx: null,
    tone(f, d, type, when, vol) {
      if (!this.on) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const t = this.ctx.currentTime + (when || 0);
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = type || 'triangle';
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(vol || 0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + d);
        o.connect(g).connect(this.ctx.destination);
        o.start(t); o.stop(t + d);
      } catch (e) { }
    },
    good(n) { this.tone(520 + Math.min(n, 12) * 45, 0.15); },
    bad() { this.tone(200, 0.2, 'sawtooth', 0, 0.06); this.tone(150, 0.3, 'sawtooth', 0.12, 0.06); },
    win() { [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.3, 'triangle', i * 0.11)); }
  };

  // ---------- menu ----------
  function showMenu() {
    game = null;
    $('#play').classList.add('hidden');
    $('#doneOverlay').classList.add('hidden');
    const m = $('#menu');
    m.classList.remove('hidden');
    const left = all.filter(x => !Store.isDone(x.q.id)).length;
    let html = `
      <div class="menu-head">
        <div class="logo">🦊</div>
        <h1>מסע הנקודה העשרונית</h1>
        <div class="stars-total">⭐ ${Store.totalStars()}</div>
      </div>
      <button class="big-btn" id="continueBtn">${left ? '▶ יאללה, לשאלה הבאה!' : '🏆 פתרת הכל! אלוף!'}</button>`;
    PAGES.forEach(page => {
      const done = page.questions.filter(q => Store.isDone(q.id)).length;
      html += `<div class="page"><h2>${page.title}</h2>
        <div class="progress"><div style="width:${100 * done / page.questions.length}%"></div></div>
        <div class="cards">`;
      page.questions.forEach(q => {
        const d = Store.get(q.id);
        html += `<button class="card ${d ? 'done' : ''}" data-id="${q.id}">
          <span class="lbl">${q.label} ${d ? '✅' : ''}</span>
          <span class="ex" dir="ltr">${q.a} × ${q.b}</span>
          <span class="st">${d ? '⭐'.repeat(d.stars) : ''}</span></button>`;
      });
      html += '</div></div>';
    });
    html += '<button class="reset" id="resetBtn">איפוס התקדמות (להורים)</button>';
    m.innerHTML = html;

    $('#continueBtn').onclick = () => { const i = nextUndone(-1); if (i >= 0) startQuestion(i); };
    m.querySelectorAll('.card').forEach(c => {
      c.onclick = () => startQuestion(all.findIndex(x => x.q.id === c.dataset.id));
    });
    $('#resetBtn').onclick = () => {
      if (confirm('למחוק את כל ההתקדמות והכוכבים?')) { Store.reset(); showMenu(); }
    };
  }

  function nextUndone(from) {
    for (let k = 1; k <= all.length; k++) {
      const i = (from + k + all.length) % all.length;
      if (!Store.isDone(all[i].q.id)) return i;
    }
    return -1;
  }

  // ---------- play ----------
  function startQuestion(i) {
    currentIdx = i;
    const { page, q } = all[i];
    $('#menu').classList.add('hidden');
    $('#doneOverlay').classList.add('hidden');
    $('#play').classList.remove('hidden');
    const pos = page.questions.indexOf(q) + 1;
    $('#qLabel').textContent = `שאלה ${q.label}`;
    $('#qProgress').textContent = `${pos} מתוך ${page.questions.length}`;
    streak = 0; renderStreak();
    const engines = { mul: window.MulGame };
    game = engines[page.type](q, $('#boardWrap'), ui);
    window.scrollTo({ top: 0 });
  }

  function say(html, mood) {
    const b = $('#bubble');
    b.innerHTML = html;
    b.className = 'bubble ' + (mood || '');
    const m = $('#mascot');
    m.classList.remove('happy', 'sad'); void m.offsetWidth;
    if (mood === 'good') m.classList.add('happy');
    if (mood === 'bad') m.classList.add('sad');
  }

  function renderStreak(bump) {
    const s = $('#streak');
    s.textContent = streak >= 3 ? `🔥${streak}` : '';
    if (bump) { s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
  }

  const ui = {
    say,
    correct(intro) {
      streak++;
      Sound.good(streak);
      renderStreak(true);
      let text = pick(PRAISE);
      if (streak > 0 && streak % 5 === 0) text = `${streak} ברצף! 🔥🔥 אתה בוער!`;
      say(text + (intro ? '<br>' + intro : ''), 'good');
    },
    wrong(hint) {
      streak = 0;
      renderStreak();
      Sound.bad();
      say(`${pick(OOPS)}<br>💡 ${hint}`, 'bad');
    },
    pop(el) {
      const r = el.getBoundingClientRect();
      const f = document.createElement('div');
      f.className = 'floater';
      f.textContent = '+1';
      f.style.left = (r.left + r.width / 2 - 14) + 'px';
      f.style.top = (r.top - 10) + 'px';
      document.body.appendChild(f);
      setTimeout(() => f.remove(), 900);
    },
    complete({ answer, trimmed, mistakes }) {
      const { q } = all[currentIdx];
      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      Store.markDone(q.id, stars, mistakes);
      Sound.win();
      confetti();
      say('🎉🎉🎉', 'good');
      setTimeout(() => {
        $('#doneTitle').textContent = pick(WIN);
        $('#doneAnswer').textContent = `${q.a} × ${q.b} = ${answer}`;
        $('#doneNote').textContent = trimmed ? 'את האפסים בסוף אחרי הנקודה אפשר למחוק 😉' : '';
        $('#doneStars').innerHTML = [1, 2, 3].map(n => `<span class="${n <= stars ? '' : 'dim'}">⭐</span>`).join('');
        const more = nextUndone(currentIdx) >= 0;
        $('#nextBtn').textContent = more ? 'לשאלה הבאה ◀' : '🏆 סיימת הכל!';
        $('#doneOverlay').classList.remove('hidden');
      }, 1100);
    }
  };

  function goNext() {
    const i = nextUndone(currentIdx);
    if (i >= 0) startQuestion(i); else showMenu();
  }

  // ---------- numpad ----------
  function buildPad() {
    const pad = $('#numpad');
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(n => {
      const b = document.createElement('button');
      b.textContent = n;
      b.onclick = () => game && game.digit(+n);
      pad.appendChild(b);
    });
    const del = document.createElement('button');
    del.textContent = '⌫'; del.className = 'del'; del.title = 'מחק ספרה קטנה';
    del.onclick = () => game && game.back();
    pad.appendChild(del);
  }

  function setPad(on) {
    $('#numpad').classList.toggle('hidden', !on);
    $('#padBtn').classList.toggle('off', !on);
    Store.setPref('pad', on);
  }
  function setSound(on) {
    Sound.on = on;
    $('#soundBtn').textContent = on ? '🔊' : '🔇';
    Store.setPref('sound', on);
  }

  // ---------- confetti ----------
  function confetti() {
    const cv = $('#confetti'), ctx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ['#ff4d8d', '#ff9f1c', '#2a9d4a', '#4361ee', '#ffd166', '#9b5de5'];
    const parts = Array.from({ length: 140 }, () => ({
      x: cv.width / 2, y: cv.height / 3,
      vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 4,
      s: 6 + Math.random() * 8, c: pick(colors), r: Math.random() * 6, vr: (Math.random() - .5) * .4
    }));
    let frames = 0;
    (function tick() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      parts.forEach(p => {
        p.vy += .4; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (++frames < 150) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }

  // ---------- wiring ----------
  document.addEventListener('keydown', e => {
    if (!$('#doneOverlay').classList.contains('hidden')) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goNext(); }
      return;
    }
    if (!game) return;
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); game.digit(+e.key); }
    else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); game.back(); }
  });

  $('#homeBtn').onclick = showMenu;
  $('#menuBtn').onclick = showMenu;
  $('#nextBtn').onclick = goNext;
  $('#padBtn').onclick = () => setPad($('#numpad').classList.contains('hidden'));
  $('#soundBtn').onclick = () => setSound(!Sound.on);

  buildPad();
  setPad(Store.pref('pad', 'ontouchstart' in window));
  setSound(Sound.on);
  showMenu();
})();
