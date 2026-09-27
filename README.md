# מסע הנקודה העשרונית 🦊

A fun Hebrew practice game for kids (around age 8) learning to multiply decimal numbers the way it's taught in school: one number above the other.

- Every digit gets checked the moment it's typed: a correct digit gets praise, and a wrong one gets a hint (then a bigger hint), so the child finds a mistake while solving, not only at the end.
- The cursor moves to the next digit on its own, right to left.
- The rows the child fills in: one row per digit of the bottom number, then the sum, then placing the decimal point.
- Keyboard digits, or the on-screen number pad (🔢 button).
- Small pink boxes at the top are an optional place to jot down carried digits.
- Stars ⭐, streaks 🔥, sounds and confetti.
- Progress is saved in the browser, so a solved question doesn't come up again.
- ✏️ "תרגיל מהחוברת" box: type any two numbers and solve them the same way (not tracked).

## Play

Download or clone the repo and double-click `index.html`. No install needed.

(Optional: `node serve.js`, then open http://localhost:5173)

## Make it personal 💖

Open `js/config.js` and change two lines:

```js
window.CONFIG = {
  name: 'תהילה',   // your child's name
  gender: 'f'      // 'f' = girl, 'm' = boy (all the Hebrew texts follow this)
};
```

Save and refresh the page. That's it.

## Add your own questions

Open `js/questions.js` and add a page:

```js
{
  id: 'mul-2',
  title: 'כפל מספרים עשרוניים – עמוד 2',
  type: 'mul',
  questions: [
    { id: 'mul-2-01', label: 'א', a: '3.4', b: '1.2' },
    { id: 'mul-2-02', label: 'ב', a: '0.25', b: '6.1' }
  ]
}
```

Every question needs its own `id`. Don't change an id after it's been played, because progress is saved by id.

## Reset progress

In the menu, "איפוס התקדמות (להורים)" at the bottom clears all stars and solved questions.
