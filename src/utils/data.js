import raw from '../data/schedule.json';

export const DAYS = ['Понеділок','Вівторок','Середа','Четвер',"П'ятниця"];

export const PERIODS = [
  {n:1, time:'08:20–09:40'},
  {n:2, time:'09:50–11:10'},
  {n:3, time:'11:30–12:50'},
  {n:4, time:'13:00–14:20'},
  {n:5, time:'14:40–16:00'},
  {n:6, time:'16:10–17:30'},
  {n:7, time:'17:40–19:00'},
];

export const TYPE_LABEL = { lecture:'Лекція', practice:'Практика', lab:'Лабораторна' };
export const TYPE_CLS   = { lecture:'lec',    practice:'prac',     lab:'lab'         };

/* ── normalise ── */
function norm(s) {
  if (!s) return s;
  // Fix all-caps joined words from old parser
  if (/^[А-ЯЄІЇA-Z'() ]{6,}$/.test(s))
    return s.charAt(0) + s.slice(1).toLowerCase();
  return s;
}

export const lessons = raw.map(l => ({ ...l, subject: norm(l.subject) }));

/* ── sorted unique values ── */
const ukSort = (a,b) => a.localeCompare(b,'uk');

export const allGroups = [...new Set(lessons.map(l=>l.group))].sort(ukSort);

export const allTeachers = [...new Set(
  lessons.map(l=>l.teacher).filter(t => t && t.length > 3 && /[А-ЯЄІЇ]/.test(t))
)].sort(ukSort);

export const allRooms = [...new Set(
  lessons.map(l=>l.room).filter(r => r && r.length > 1)
)].sort(ukSort);

/* ── group metadata ── */
export function groupCourse(g) {
  const m = g.match(/^(\d)/);
  return m ? m[1] : '?';
}

// Speciality code: first 2-3 digits after course digit
export function groupSpec(g) {
  // FMI style: "143(1)" → "43"
  const mFmi = g.match(/^\d(\d{2})\(/);
  if (mFmi) return mFmi[1];
  // ІФТКН style: "121 група" → "21"; "213+213ск" → "13"
  const mNum = g.match(/^\d(\d{2})/);
  if (mNum) return mNum[1];
  return null;
}

export const SPEC_NAMES = {
  '11': 'E5 — Фізика та астрономія',
  '13': 'E6/G7 — Прикл. фізика / Автоматизація',
  '15': 'A4 — Середня освіта (Технології)',
  '16': 'A5 — Проф. освіта (Машинобудування)',
  '17': 'F6 — Інформаційні системи і технології',
  '31': 'G3 — Електрична інженерія',
  '21': '121 — Ел.комун. (Інженерія)',
  '22': '122 — Інф.-вим. технології',
  '24': '124 — Ел.комун. (Телеком)',
  '25': '125 — Кібербез. та захист інф.',
  '26': '126 — Видавнича та поліграфічна',
  '41': '121 — Інж. ПЗ ',
  '43': '121/141/143 — Інж. ПЗ',
  '44': '123 — Комп. інженерія',
  '42': '122/142 — Комп. науки',
};

/* ── grid builder ── */
export function buildGrid({ filterMode, group, teacher, room, week, query }) {
  let data = lessons.filter(l => l.week === week);

  if (filterMode === 'group')   data = data.filter(l => l.group   === group);
  if (filterMode === 'teacher') data = data.filter(l => l.teacher === teacher);
  if (filterMode === 'room')    data = data.filter(l => l.room    === room);

  if (query.trim()) {
    const q = query.toLowerCase();
    data = data.filter(l =>
      l.subject.toLowerCase().includes(q) ||
      l.teacher.toLowerCase().includes(q) ||
      l.room.toLowerCase().includes(q) ||
      l.group.toLowerCase().includes(q)
    );
  }

  const grid = {};
  DAYS.forEach(d => {
    grid[d] = {};
    PERIODS.forEach(p => { grid[d][p.n] = []; });
  });
  data.forEach(l => {
    if (grid[l.day] && grid[l.day][l.period] !== undefined)
      grid[l.day][l.period].push(l);
  });
  return grid;
}

export function countGrid(grid) {
  let n = 0;
  DAYS.forEach(d => PERIODS.forEach(p => { if (grid[d]?.[p.n]?.length) n++; }));
  return n;
}
