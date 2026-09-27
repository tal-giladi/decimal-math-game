// Progress + preferences, kept in this browser's localStorage.
window.Store = (function () {
  const KEY = 'decimalGame.v1';
  let data = null;
  try { data = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
  if (!data || typeof data !== 'object') data = {};
  data.done = data.done || {};
  data.prefs = data.prefs || {};

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { }
  }

  return {
    isDone: id => !!data.done[id],
    get: id => data.done[id],
    markDone(id, stars, mistakes) {
      const prev = data.done[id];
      data.done[id] = {
        stars: Math.max(stars, prev ? prev.stars : 0),
        mistakes: prev ? Math.min(prev.mistakes, mistakes) : mistakes,
        at: Date.now()
      };
      save();
    },
    totalStars: () => Object.values(data.done).reduce((s, d) => s + d.stars, 0),
    pref: (k, def) => (k in data.prefs ? data.prefs[k] : def),
    setPref(k, v) { data.prefs[k] = v; save(); },
    reset() { data.done = {}; save(); }
  };
})();
