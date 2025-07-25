import React from 'react';

export default function Trash({ todos, onRestore, onDelete }) {
  return (
    <div className="trash-card">
      <h2 style={{marginBottom: 4, fontWeight: 700, fontSize: '1.5rem'}}>🗑️ Trash</h2>
      <div style={{color:'#6366f1', fontSize:'1.05rem', marginBottom: '1.2rem'}}>Deleted tasks can be restored or permanently removed.</div>
      {todos.length === 0 ? (
        <div className="empty" style={{padding:'2.5rem 0'}}>
          <div style={{fontSize:'2.5rem', marginBottom:8}}>🗑️</div>
          <div>No trashed tasks.</div>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li className="todo-item" key={todo.id} style={{alignItems:'center', justifyContent:'space-between', display:'flex'}}>
              <span className="todo-text" style={{flex:1}}>{todo.title}</span>
              <div style={{display:'flex', gap:'0.5rem'}}>
                <button
                  className="todo-add-btn"
                  style={{background:'linear-gradient(90deg,#22c55e 0%,#4ade80 100%)', color:'#fff', fontWeight:600, padding:'0.4rem 1rem'}}
                  onClick={() => onRestore(todo.id)}
                  title="Restore"
                >
                  ♻️ Restore
                </button>
                <button
                  className="todo-delete-btn"
                  style={{background:'#fee2e2', color:'#ef4444', fontWeight:600, padding:'0.4rem 1rem'}}
                  onClick={() => onDelete(todo.id)}
                  title="Delete Forever"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 