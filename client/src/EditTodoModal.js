import React, { useState } from 'react';

export default function EditTodoModal({ todo, open, onClose, onSave }) {
  const [title, setTitle] = useState(todo?.title || '');
  const [dueDate, setDueDate] = useState(todo?.due_date ? todo.due_date.slice(0, 10) : '');
  const [completed, setCompleted] = useState(!!todo?.completed);
  const [showDuePicker, setShowDuePicker] = useState(false);

  if (!open) return null;

  // Date picker modal for due date
  const DueDatePickerModal = ({ open, onClose, onSelect }) => {
    if (!open) return null;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <h3>Select Due Date</h3>
          <div className="calendar-grid" style={{marginBottom:16}}>
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              return (
                <div
                  key={day}
                  className={`calendar-day${dueDate && new Date(dueDate).getDate() === day ? ' selected' : ''}`}
                  onClick={() => {
                    const d = new Date(year, month, day);
                    setDueDate(d.toISOString().slice(0, 10));
                    onSelect && onSelect(d.toISOString().slice(0, 10));
                    setShowDuePicker(false);
                  }}
                  tabIndex={0}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <button className="todo-add-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  };

  const handleSave = () => {
    onSave({
      ...todo,
      title,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      completed,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Edit Task</h2>
        <input
          className="todo-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
        />
        <label>Due Date</label>
        <button
          className="todo-add-btn"
          type="button"
          style={{marginBottom:8, minWidth:110}}
          onClick={() => setShowDuePicker(true)}
        >
          {dueDate ? `Due: ${new Date(dueDate).toLocaleDateString()}` : 'Set Due Date'}
        </button>
        <label style={{marginTop:8}}>
          <input
            type="checkbox"
            checked={completed}
            onChange={e => setCompleted(e.target.checked)}
          /> Completed
        </label>
        <div className="modal-actions">
          <button className="todo-add-btn" onClick={handleSave}>Save</button>
          <button className="todo-delete-btn" onClick={onClose}>Cancel</button>
        </div>
        <DueDatePickerModal open={showDuePicker} onClose={() => setShowDuePicker(false)} />
      </div>
    </div>
  );
} 