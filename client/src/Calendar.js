import React from 'react';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ todos, onDayClick, selectedDay }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const today = now.getDate();

  // Map days with tasks
  const daysWithTasks = new Set(
    todos
      .filter(todo => todo.due_date && !todo.trashed)
      .map(todo => new Date(todo.due_date).getDate())
  );

  // Find the weekday of the 1st of the month
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <span>{now.toLocaleString('default', { month: 'long' })} {year}</span>
      </div>
      <div className="calendar-weekdays">
        {weekdays.map(w => (
          <div key={w} className="calendar-weekday">{w}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {Array(firstDayOfWeek).fill(null).map((_, i) => (
          <div key={'empty-' + i} className="calendar-day empty"></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const hasTask = daysWithTasks.has(day);
          const isToday = day === today;
          const isSelected = selectedDay === day;
          return (
            <div
              key={day}
              className={`calendar-day${hasTask ? ' has-task' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
              onClick={() => onDayClick(day)}
              tabIndex={0}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
} 