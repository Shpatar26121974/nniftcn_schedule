import React, { useState, useMemo } from 'react';
import { allGroups, allTeachers, allRooms, buildGrid, countGrid } from './utils/data';
import Sidebar from './components/Sidebar';
import Grid    from './components/Grid';
import './App.css';

export default function App() {
  const [mode,    setMode]    = useState('group');
  const [group,   setGroup]   = useState(allGroups[0] || '');
  const [teacher, setTeacher] = useState(allTeachers[0] || '');
  const [room,    setRoom]    = useState(allRooms[0] || '');
  const [week,    setWeek]    = useState(1);
  const [query,   setQuery]   = useState('');

  const grid = useMemo(
    () => buildGrid({ filterMode:mode, group, teacher, room, week, query }),
    [mode, group, teacher, room, week, query]
  );
  const count = useMemo(() => countGrid(grid), [grid]);

  const title =
    mode === 'group'   ? `Група ${group}` :
    mode === 'teacher' ? teacher || 'Оберіть викладача' :
                         `Аудиторія ${room}`;

  return (
    <div className="app">
      <header className="hdr">
        <div className="hdr-brand">
          <span className="hdr-badge">ЧНУ</span>
          <div>
            <div className="hdr-title">Розклад занять — ННІФТКН</div>
            <div className="hdr-sub">ІІ семестр 2025–2026 · {allGroups.length} груп · {allTeachers.length} викладачів</div>
          </div>
        </div>
        <div className="hdr-week">
          <button className={week===1?'active':''} onClick={()=>setWeek(1)}>Тиждень 1</button>
          <button className={week===2?'active':''} onClick={()=>setWeek(2)}>Тиждень 2</button>
        </div>
      </header>

      <div className="body">
        <Sidebar
          mode={mode}       setMode={setMode}
          group={group}     setGroup={setGroup}
          teacher={teacher} setTeacher={setTeacher}
          room={room}       setRoom={setRoom}
          week={week}       setWeek={setWeek}
          query={query}     setQuery={setQuery}
          count={count}
        />
        <Grid
          grid={grid}
          mode={mode}
          title={title}
          week={week}
          query={query}
        />
      </div>
    </div>
  );
}
