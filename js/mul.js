// Vertical ("one number above the other") decimal multiplication, checked digit by digit.
// Method taught in class: multiply as whole numbers, then place the decimal point
// by counting the digits after the point in both numbers.
(function () {
  const digitsOf = s => s.replace('.', '');
  const decs = s => { const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
  const rev = n => String(n).split('').reverse().map(Number);
  const howMany = n => (n === 1 ? 'ספרה אחת' : `${n} ספרות`);

  function MulGame(q, root, ui) {
    const aStr = digitsOf(q.a), bStr = digitsOf(q.b);
    const aDec = decs(q.a), bDec = decs(q.b);
    const aInt = parseInt(aStr, 10), bInt = parseInt(bStr, 10);
    const aRev = rev(aInt), bRev = rev(bInt);
    const product = aInt * bInt, prodRev = rev(product);
    const decimals = aDec + bDec;

    const partials = [];
    bRev.forEach((d, i) => { if (d !== 0) partials.push({ d, shift: i, digits: rev(aInt * d), cellAt: {} }); });
    const needSum = partials.length > 1;

    const W = Math.max(aStr.length, bStr.length, prodRev.length, decimals + 1,
      ...partials.map(p => p.shift + p.digits.length));

    // ---------- board ----------
    root.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'board';
    board.style.gridTemplateColumns = `repeat(${W + 1}, var(--cell))`;
    root.appendChild(board);

    const occupied = {}, rowEls = {};
    let row = 0;
    function place(elm, r, col) {
      elm.style.gridRow = r; elm.style.gridColumn = col;
      board.appendChild(elm);
      (rowEls[r] = rowEls[r] || []).push(elm);
      return elm;
    }
    function cell(r, colR, cls, text) {
      const c = document.createElement('div');
      c.className = 'cell ' + (cls || '');
      if (text != null) c.textContent = text;
      (occupied[r] = occupied[r] || {})[colR] = true;
      return place(c, r, 1 + W - colR);
    }
    function sign(r, t) {
      const s = document.createElement('div');
      s.className = 'cell sign'; s.textContent = t;
      (occupied[r] = occupied[r] || {}).sign = true;
      return place(s, r, 1);
    }
    const rowKinds = {};
    function newRow(kind) { row++; rowKinds[row] = kind; return row; }

    // scratch row for carries (not checked)
    const carryRow = newRow('carry');
    const carryCells = [];
    for (let c = 1; c < W; c++) {
      const cc = cell(carryRow, c, 'carry');
      cc.addEventListener('click', () => selectCarry(cc));
      carryCells.push(cc);
    }

    function numberRow(str, dec, kind) {
      const r = newRow(kind), cells = [];
      for (let k = 0; k < str.length; k++) {
        const ch = str[str.length - 1 - k];
        cells.push(cell(r, k, 'given' + (dec > 0 && k === dec ? ' dot' : ''), ch));
      }
      return { r, cells };
    }
    const A = numberRow(aStr, aDec, 'num');
    const B = numberRow(bStr, bDec, 'num under');
    sign(B.r, '×');

    partials.forEach(p => {
      p.r = newRow('work');
      for (let c = 0; c < p.shift; c++) p.cellAt[c] = cell(p.r, c, 'given ghost', '0');
      p.digits.forEach((_, k) => { p.cellAt[p.shift + k] = cell(p.r, p.shift + k, 'input'); });
    });
    let sumR = null;
    const sumCells = {};
    if (needSum) {
      const last = partials[partials.length - 1];
      rowKinds[last.r] += ' under';
      sign(last.r, '+');
      sumR = newRow('work');
      prodRev.forEach((_, c) => { sumCells[c] = cell(sumR, c, 'input'); });
    }

    // fill empty grid squares so it looks like graph paper
    for (let r = 1; r <= row; r++) {
      for (let c = 0; c < W; c++) if (!(occupied[r] || {})[c]) cell(r, c, rowKinds[r] === 'carry' ? 'carry blank' : 'blank');
      if (!(occupied[r] || {}).sign) sign(r, '').classList.add(rowKinds[r] === 'carry' ? 'carry' : 'blank');
      if (rowKinds[r].includes('under')) rowEls[r].forEach(e => e.classList.add('under'));
    }

    // ---------- steps ----------
    const steps = [];
    let prevShift = -1;
    partials.forEach((p, pi) => {
      let carry = 0;
      let intro;
      if (pi === 0) {
        intro = `כופלים את ${q.a} בספרה ${p.d} הצהובה.<br>מתחילים מהספרה הכי ימנית 👉`;
      } else {
        intro = `שורה חדשה! עכשיו כופלים בספרה ${p.d}.<br>` +
          `שמנו ${p.shift === 1 ? '0' : p.shift + ' אפסים'} שומר מקום 👻`;
      }
      if (p.shift > prevShift + 1) intro += '<br>(על ה-0 מדלגים – כפול 0 זה תמיד 0 😴)';
      prevShift = p.shift;

      p.digits.forEach((expected, k) => {
        const s = { el: p.cellAt[p.shift + k], expected, clearCarry: k === 0, intro: k === 0 ? intro : null };
        if (k < aRev.length) {
          const a = aRev[k], m = a * p.d, v = m + carry;
          s.hl = [A.cells[k], B.cells[p.shift]];
          s.hints = [
            `כמה זה ${a} × ${p.d}?` + (carry ? ` ואל תשכחי להוסיף את ה-${carry} שזכרנו!` : ''),
            `${a} × ${p.d} = ${m}` + (carry ? `, ועוד ${carry} שזכרנו = ${v}` : ''),
            v >= 10 ? `כותבים ${v % 10} וזוכרים ${Math.floor(v / 10)}` : `כותבים ${v % 10}`
          ];
          carry = Math.floor(v / 10);
        } else {
          s.hl = [];
          s.hints = [
            'נשאר לנו משהו שזכרנו מקודם... 🤔',
            `זכרנו ${carry} – כותבים אותו בסוף השורה`,
            `כותבים ${carry}`
          ];
        }
        steps.push(s);
      });
    });

    if (needSum) {
      let carry = 0;
      prodRev.forEach((expected, c) => {
        const parts = [], hl = [];
        partials.forEach(p => {
          if (p.cellAt[c]) {
            hl.push(p.cellAt[c]);
            if (c >= p.shift) parts.push(p.digits[c - p.shift]);
          }
        });
        const v = parts.reduce((x, y) => x + y, 0) + carry;
        const expr = parts.concat(carry ? [carry] : []).join(' + ') || '0';
        steps.push({
          el: sumCells[c], expected, hl,
          clearCarry: c === 0,
          intro: c === 0 ? 'כל השורות מוכנות! 💪<br>עכשיו מחברים אותן ➕ מתחילים מימין' : null,
          hints: [
            parts.length ? `חברי את הספרות בעמודה הצהובה` + (carry ? ` ועוד ${carry} שזכרנו` : '') : `נשאר לנו ${carry} שזכרנו`,
            `${expr} = ${v}`,
            v >= 10 ? `כותבים ${v % 10} וזוכרים ${Math.floor(v / 10)}` : `כותבים ${v % 10}`
          ]
        });
        carry = Math.floor(v / 10);
      });
    }

    const finalR = needSum ? sumR : partials[0].r;
    const finalCells = needSum ? sumCells : partials[0].cellAt;

    // ---------- play ----------
    let idx = -1, mistakes = 0, carryTarget = null, phase = 'digits', pointFails = 0, finished = false;

    function clearHl() { board.querySelectorAll('.hl').forEach(e => e.classList.remove('hl')); }

    function startStep(i, praised) {
      clearHl();
      idx = i;
      if (i >= steps.length) {
        if (decimals > 0) return startPoint(praised);
        finished = true;
        return ui.complete({ answer: formatAnswer(), trimmed: false, mistakes });
      }
      const s = steps[i];
      s.fails = 0;
      if (s.clearCarry) carryCells.forEach(c => { c.textContent = ''; });
      s.el.classList.add('active');
      s.hl.forEach(e => e.classList.add('hl'));
      s.el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      if (praised) ui.correct(s.intro);
      else if (s.intro) ui.say(s.intro, 'info');
    }

    function digit(d) {
      if (finished) return;
      if (carryTarget) {
        carryTarget.textContent = d;
        carryTarget.classList.remove('selected');
        carryTarget = null;
        return;
      }
      if (phase !== 'digits') return;
      const s = steps[idx];
      if (d === s.expected) {
        s.el.textContent = d;
        s.el.classList.remove('active', 'wrong');
        s.el.classList.add('ok');
        ui.pop(s.el);
        startStep(idx + 1, true);
      } else {
        mistakes++;
        s.fails++;
        s.el.textContent = d;
        s.el.classList.remove('wrong'); void s.el.offsetWidth; s.el.classList.add('wrong');
        setTimeout(() => { if (!s.el.classList.contains('ok')) s.el.textContent = ''; }, 600);
        ui.wrong(s.hints[Math.min(s.fails, s.hints.length) - 1]);
      }
    }

    function selectCarry(cc) {
      if (finished) return;
      if (carryTarget) carryTarget.classList.remove('selected');
      if (carryTarget === cc) { carryTarget = null; return; }
      cc.textContent = '';
      carryTarget = cc;
      cc.classList.add('selected');
    }

    function back() {
      if (carryTarget) { carryTarget.textContent = ''; carryTarget.classList.remove('selected'); carryTarget = null; }
    }

    // ---------- decimal point ----------
    const gaps = [];
    function startPoint(praised) {
      phase = 'point';
      const text = 'כל הספרות נכונות! 🎯<br>עכשיו הכי חשוב: איפה שמים את הנקודה?<br>לחצי על העיגול הנכון 👇';
      if (praised) ui.correct(text); else ui.say(text, 'info');
      for (let p = 1; p <= prodRev.length; p++) {
        const g = document.createElement('button');
        g.className = 'gap';
        g.title = 'כאן?';
        g.addEventListener('click', () => pickPoint(p, g));
        place(g, finalR, 1 + W - (p - 1));
        gaps.push(g);
      }
    }

    function pickPoint(p, g) {
      if (finished) return;
      const len = prodRev.length;
      const correct = p === Math.min(decimals, len);
      if (!correct) {
        mistakes++;
        pointFails++;
        g.classList.remove('wrong'); void g.offsetWidth; g.classList.add('wrong');
        A.cells.forEach((c, k) => { if (k < aDec) c.classList.add('dec-hl'); });
        B.cells.forEach((c, k) => { if (k < bDec) c.classList.add('dec-hl'); });
        ui.wrong(pointFails === 1
          ? `ב-${q.a} יש ${howMany(aDec)} אחרי הנקודה, וב-${q.b} יש ${howMany(bDec)} (הן בוורוד). כמה ביחד?`
          : `${aDec} + ${bDec} = ${decimals} ← סופרים ${howMany(decimals)} מימין, ושם שמים את הנקודה`);
        return;
      }
      finished = true;
      gaps.forEach(x => x.remove());
      if (p < len) {
        finalCells[p].classList.add('dot');
      } else {
        for (let c = len; c < decimals; c++) cell(finalR, c, 'given pad', '0');
        cell(finalR, Math.max(len, decimals), 'given pad dot', '0');
      }
      ui.complete({ answer: formatAnswer(), trimmed: hasTrailingZero(), mistakes });
    }

    function hasTrailingZero() { return decimals > 0 && product % 10 === 0; }
    function formatAnswer() {
      if (decimals === 0) return String(product);
      const s = String(product).padStart(decimals + 1, '0');
      const intPart = s.slice(0, s.length - decimals);
      const frac = s.slice(s.length - decimals).replace(/0+$/, '');
      return frac ? `${intPart}.${frac}` : intPart;
    }

    startStep(0, false);
    return { digit, back };
  }

  window.MulGame = MulGame;
})();
