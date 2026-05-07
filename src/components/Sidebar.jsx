import React, { useState, useMemo } from 'react';
import { allGroups, allTeachers, allRooms, groupCourse, groupSpec, SPEC_NAMES } from '../utils/data';
import './Sidebar.css';

export default function Sidebar({
  mode, setMode,
  group, setGroup,
  teacher, setTeacher,
  room, setRoom,
  query, setQuery,
  count,
}) {
  const [course,  setCourse]  = useState('');
  const [spec,    setSpec]    = useState('');
  const [tSearch, setTSearch] = useState('');
  const [rSearch, setRSearch] = useState('');

  /* ── derived lists ── */
  const courses = useMemo(() =>
    [...new Set(allGroups.map(groupCourse))].sort(), []);

  const specs = useMemo(() => {
    const seen = new Set();
    const res  = [];
    allGroups.forEach(g => {
      const s = groupSpec(g);
      if (s && !seen.has(s)) {
        seen.add(s);
        res.push({ code: s, label: SPEC_NAMES[s] || `Спец. ${s}` });
      }
    });
    return res.sort((a,b) => a.label.localeCompare(b.label,'uk'));
  }, []);

  const filteredGroups = useMemo(() =>
    allGroups.filter(g => {
      if (course && groupCourse(g) !== course) return false;
      if (spec   && groupSpec(g)   !== spec)   return false;
      return true;
    }), [course, spec]);

  const filteredTeachers = useMemo(() => {
    if (!tSearch.trim()) return allTeachers;
    const q = tSearch.toLowerCase();
    return allTeachers.filter(t => t.toLowerCase().includes(q));
  }, [tSearch]);

  const filteredRooms = useMemo(() => {
    if (!rSearch.trim()) return allRooms;
    const q = rSearch.toLowerCase();
    return allRooms.filter(r => r.toLowerCase().includes(q));
  }, [rSearch]);

  return (
    <aside className="sb">

      {/* Mode tabs */}
      <div className="sb-sec sb-sec--sm">
        <div className="tabs">
          {[['group','👥 Група'],['teacher','🎓 Викладач'],['room','🚪 Аудиторія']].map(([m,l]) => (
            <button key={m} className={`tab ${mode===m?'on':''}`} onClick={() => setMode(m)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="sb-sec">
        <label className="sb-label">Пошук</label>
        <input className="sb-inp" type="text"
          placeholder="Предмет, група, викладач..."
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {/* ── GROUP MODE ── */}
      {mode === 'group' && (<>
        <div className="sb-sec">
          <label className="sb-label">Курс</label>
          <div className="pills">
            <button className={`pill ${course===''?'on':''}`} onClick={() => { setCourse(''); }}>Всі</button>
            {courses.map(c => (
              <button key={c} className={`pill ${course===c?'on':''}`}
                onClick={() => setCourse(c)}>{c} курс</button>
            ))}
          </div>
        </div>

        
        <div className="sb-sec sb-sec--list">
          <label className="sb-label">
            Група &nbsp;<span className="cnt">({filteredGroups.length})</span>
          </label>
          <div className="list">
            {filteredGroups.map(g => (
              <button key={g}
                className={`list-item ${group===g?'on':''}`}
                onClick={() => setGroup(g)}
              >{g}</button>
            ))}
          </div>
        </div>
      </>)}

      {/* ── TEACHER MODE ── */}
      {mode === 'teacher' && (
        <div className="sb-sec sb-sec--list">
          <label className="sb-label">
            Викладач &nbsp;<span className="cnt">({filteredTeachers.length})</span>
          </label>
          <input className="sb-inp" type="text"
            placeholder="Фільтр за прізвищем..."
            value={tSearch} onChange={e => setTSearch(e.target.value)}
            style={{marginBottom:10}} />
          <div className="list">
            {filteredTeachers.map(t => (
              <button key={t}
                className={`list-item ${teacher===t?'on':''}`}
                onClick={() => setTeacher(t)}
              >{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── ROOM MODE ── */}
      {mode === 'room' && (
        <div className="sb-sec sb-sec--list">
          <label className="sb-label">
            Аудиторія &nbsp;<span className="cnt">({filteredRooms.length})</span>
          </label>
          <input className="sb-inp" type="text"
            placeholder="Фільтр за номером..."
            value={rSearch} onChange={e => setRSearch(e.target.value)}
            style={{marginBottom:10}} />
          <div className="list">
            {filteredRooms.map(r => (
              <button key={r}
                className={`list-item ${room===r?'on':''}`}
                onClick={() => setRoom(r)}
              >{r}</button>
            ))}
          </div>
        </div>
      )}

      
      {/* Legend */}
      <div className="sb-sec sb-legend">
        <div className="leg-row"><span className="dot dot--lec"/>Лекція</div>
        <div className="leg-row"><span className="dot dot--prac"/>Практика</div>
        <div className="leg-row"><span className="dot dot--lab"/>Лабораторна</div>
      </div>

    </aside>
  );
}
