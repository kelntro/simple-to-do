import { useEffect, useState } from 'react';
import axios from 'axios';
import EditTodoModal from './EditTodoModal';
import Calendar from './Calendar';
import Trash from './Trash';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([]);
  const [showTrash, setShowTrash] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calendarDay, setCalendarDay] = useState(null);
  const [showDuePicker, setShowDuePicker] = useState(false);

  const API_URL = 'http://localhost:5000/api/todos';

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;
    await axios.post(API_URL, {
      title,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    setTitle('');
    setDueDate('');
    setShowDuePicker(false);
    fetchTodos();
  };

  const updateTodo = async (todo) => {
    await axios.put(`${API_URL}/${todo.id}`, todo);
    setModalOpen(false);
    setEditTodo(null);
    fetchTodos();
  };

  const trashTodo = async (id) => {
    await axios.patch(`${API_URL}/${id}/trash`);
    fetchTodos();
  };

  const restoreTodo = async (id) => {
    await axios.patch(`${API_URL}/${id}/restore`);
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  const setEdit = (todo) => {
    setEditTodo(todo);
    setModalOpen(true);
  };

  const todosToShow = todos.filter(t => !t.trashed && (!calendarDay || (t.due_date && new Date(t.due_date).getDate() === calendarDay)));
  const trashedTodos = todos.filter(t => t.trashed);

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
                    setDueDate(d.toISOString());
                    onSelect && onSelect(d.toISOString());
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

  return (
    <div className="desktop-app-layout">
      <aside className="sidebar">
        <h1 className="todo-title">To-Do App</h1>
        <Calendar todos={todos} onDayClick={setCalendarDay} selectedDay={calendarDay} />
        <button className="todo-add-btn sidebar-btn" onClick={() => setShowTrash(v => !v)}>
          {showTrash ? 'Back to Tasks' : 'View Trash'}
        </button>
      </aside>
      <main className="main-content">
        {showTrash ? (
          <Trash todos={trashedTodos} onRestore={restoreTodo} onDelete={deleteTodo} />
        ) : (
          <>
            <form className="todo-input-group" onSubmit={e => { e.preventDefault(); addTodo(); }}>
              <input
                className="todo-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a new task..."
              />
              <button
                className="todo-add-btn"
                type="button"
                onClick={() => setShowDuePicker(true)}
                style={{minWidth:110}}
              >
                {dueDate ? `Due: ${new Date(dueDate).toLocaleDateString()}` : 'Set Due Date'}
              </button>
              <button className="todo-add-btn" type="submit">Add</button>
            </form>
            <ul className="todo-list">
              {todosToShow.map(todo => (
                <li className={`todo-item${todo.completed ? ' completed' : ''}`} key={todo.id}>
                  <input
                    type="checkbox"
                    checked={!!todo.completed}
                    onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
                  />
                  <span className="todo-text">{todo.title}</span>
                  {todo.due_date && (
                    <span className="todo-due">Due: {new Date(todo.due_date).toLocaleString()}</span>
                  )}
                  <button className="todo-edit-btn" onClick={() => setEdit(todo)} title="Edit">✏️</button>
                  <button className="todo-delete-btn" onClick={() => trashTodo(todo.id)} title="Trash">🗑️</button>
                </li>
              ))}
            </ul>
            <DueDatePickerModal open={showDuePicker} onClose={() => setShowDuePicker(false)} />
          </>
        )}
      </main>
      <EditTodoModal
        todo={editTodo}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={updateTodo}
      />
    </div>
  );
}

export default App;
