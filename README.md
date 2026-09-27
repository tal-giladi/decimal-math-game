# מסע הנקודה העשרונית

Decimal multiplication practice for kids, checked digit by digit.

Run: open `index.html` in a browser, or `node serve.js` → http://localhost:5173

- Questions live in `js/questions.js` — one entry per workbook page. Never change an existing question `id` (progress is saved by id in localStorage).
- Engine per page `type`: `mul` → `js/mul.js`. Division (`div`) is next.
- Keyboard digits or the on-screen pad (🔢). Small pink boxes on top are an optional scratch row for carries.
