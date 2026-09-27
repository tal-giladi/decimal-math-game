// ✏️ Make it personal: change these two lines.
window.CONFIG = {
  name: 'תהילה',   // the child's name
  gender: 'f'      // 'f' = girl (feminine Hebrew), 'm' = boy (masculine Hebrew)
};

// Picks the right Hebrew form: G('נסי', 'נסה')
window.G = (f, m) => (window.CONFIG.gender === 'm' ? m : f);
