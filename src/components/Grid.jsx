import React from 'react';
import { DAYS, PERIODS, TYPE_LABEL, TYPE_CLS } from '../utils/data';
import './Grid.css';

function LessonCard({ lesson, showGroup }) {
  const cls = TYPE_CLS[lesson.type] || 'prac';
  return (
    <div className={`card card--${cls}`}>
      <span className="card-type">{TYPE_LABEL[lesson.type]}</span>
      <span className="card-subj">{lesson.subject}</span>
      {showGroup && lesson.group && <span className="card-group">{lesson.group}</span>}
      {lesson.teacher && <span className="card-teacher">{lesson.teacher}</span>}
      {lesson.room    && <span className="card-room">{lesson.room}</span>}
    </div>
  );
}

export default function Grid({ grid, mode, title, week, query }) {
  const showGroup = mode !== 'group';
  const weekLabel = week === 1 ? '1-й (непарний) тиждень' : '2-й (парний) тиждень';

  return (
    <div className="grid-wrap">
      <div className="grid-hdr">
        <div className="grid-title-row">
          <h2 className="grid-title">{title}</h2>
          {query && <span className="grid-badge-q">🔍 {query}</span>}
        </div>
        <span className="grid-badge-w">{weekLabel}</span>
      </div>

      <div className="grid-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th className="th th--p">Пара</th>
              {DAYS.map(d => <th key={d} className="th th--d">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map(p => {
              const hasAny = DAYS.some(d => grid[d]?.[p.n]?.length > 0);
              return (
                <tr key={p.n} className={hasAny ? '' : 'tr--empty'}>
                  <td className="td td--p">
                    <span className="p-num">{p.n}</span>
                    <span className="p-time">{p.time}</span>
                  </td>
                  {DAYS.map(d => {
                    const cells = grid[d]?.[p.n] || [];
                    return (
                      <td key={d} className="td td--l">
                        {cells.length > 0
                          ? cells.map((l,i) => <LessonCard key={i} lesson={l} showGroup={showGroup}/>)
                          : <div className="empty-cell"/>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
