// Every workbook page is one entry. Question ids must never change — progress is saved by id.
// type: 'mul' (multiplication). 'div' (division) will be added later.
window.PAGES = [
  {
    id: 'mul-1',
    title: 'כפל מספרים עשרוניים – עמוד 1',
    type: 'mul',
    questions: [
      { id: 'mul-1-01', label: 'א',    a: '4.3',    b: '2.5' },
      { id: 'mul-1-02', label: 'ב',    a: '8.97',   b: '5.3' },
      { id: 'mul-1-03', label: 'ג',    a: '13.9',   b: '0.7' },
      { id: 'mul-1-04', label: 'ד',    a: '1.123',  b: '6.1' },
      { id: 'mul-1-05', label: 'ה',    a: '32.06',  b: '7.5' },
      { id: 'mul-1-06', label: 'ו',    a: '14.9',   b: '1.2' },
      { id: 'mul-1-07', label: 'ז',    a: '76.9',   b: '8.2' },
      { id: 'mul-1-08', label: 'ח',    a: '66.66',  b: '0.6' },
      { id: 'mul-1-09', label: 'ט',    a: '0.056',  b: '9.8' },
      { id: 'mul-1-10', label: 'י',    a: '35.35',  b: '3.5' },
      { id: 'mul-1-11', label: 'י״א',  a: '19.04',  b: '9.4' },
      { id: 'mul-1-12', label: 'י״ב',  a: '2.675',  b: '5.7' },
      { id: 'mul-1-13', label: 'י״ג',  a: '101.9',  b: '0.06' },
      { id: 'mul-1-14', label: 'י״ד',  a: '67.02',  b: '2.05' },
      { id: 'mul-1-15', label: 'ט״ו',  a: '24.03',  b: '1.01' },
      { id: 'mul-1-16', label: 'ט״ז',  a: '19.55',  b: '0.456' }
    ]
  },
  {
    id: 'mul-2',
    title: 'כפל מספרים עשרוניים – עמוד 2: מצאי את הקשר',
    type: 'mul',
    questions: [
      { id: 'mul-2-01', label: 'א', a: '4.375', b: '0.4' },
      { id: 'mul-2-02', label: 'ב', a: '5.5',   b: '0.5' },
      { id: 'mul-2-03', label: 'ג', a: '2.5',   b: '1.5' },
      { id: 'mul-2-04', label: 'ד', a: '1.9',   b: '2.5' },
      { id: 'mul-2-05', label: 'ה', a: '12.5',  b: '0.8' },
      { id: 'mul-2-06', label: 'ו', a: '0.4',   b: '2.5' },
      { id: 'mul-2-07', label: 'ז', a: '0.5',   b: '0.2' },
      { id: 'mul-2-08', label: 'ח', a: '0.1',   b: '0.1' }
    ]
  },
  {
    id: 'mul-3',
    title: 'כפל מספרים עשרוניים – עמוד 3: האותיות',
    type: 'mul',
    questions: [
      { id: 'mul-3-01', label: 'מ', a: '0.043', b: '9' },
      { id: 'mul-3-02', label: 'א', a: '0.45',  b: '2.3' },
      { id: 'mul-3-03', label: 'ת', a: '0.038', b: '5' },
      { id: 'mul-3-04', label: 'ת', a: '0.06',  b: '1.5' },
      { id: 'mul-3-05', label: 'ד', a: '17.8',  b: '0.23' },
      { id: 'mul-3-06', label: 'ב', a: '83.4',  b: '2.3' },
      { id: 'mul-3-07', label: 'ח', a: '25.7',  b: '3.2' },
      { id: 'mul-3-08', label: 'ו', a: '12.5',  b: '3.6' }
    ]
  }
];
