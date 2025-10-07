import React, { useEffect, useState } from 'react';

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('todo:tasks');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    try {
      localStorage.setItem('todo:tasks', JSON.stringify(tasks));
    } catch (e) {
    }
  }, [tasks]);

  // inject basic styles once
  useEffect(() => {
    if (document.getElementById('todo-app-styles')) return;
    const css = `
      .todo-root{font-family: Inter, Roboto, system-ui, -apple-system, 'Segoe UI';max-width:720px;margin:24px auto;padding:20px}
      .card{background:lightblue;border-radius:12px;box-shadow:0 6px 18px rgba(17,24,39,0.06);padding:18px}
      .header{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:14px}
      .title{font-size:20px;font-weight:600}
      .input-row{display:flex;gap:8px}
      .text-input{flex:1;padding:10px 12px;border-radius:8px;border:1px solid #e6e6e9;font-size:14px}
      .add-btn{padding:10px 14px;border-radius:8px;border:none;background:#4f46e5;color:white;font-weight:600;cursor:pointer}
      .add-btn:disabled{opacity:0.6;cursor:not-allowed}
      .filters{display:flex;gap:8px;align-items:center}
      .filter-btn{padding:6px 10px;border-radius:8px;border:1px solid transparent;background:transparent;cursor:pointer}
      .filter-btn.active{background:#eef2ff;border-color:#c7d2fe}
      .list{margin-top:12px;display:flex;flex-direction:column;gap:8px}
      .task{display:flex;gap:12px;align-items:center;incomplete:10px;border-radius:8px;border:1px solid #f0f0f2}
      .task.completed{opacity:0.6;text-decoration:line-through;background:linear-gradient(90deg,#f8fafc,#ffffff)}
      .task-label{flex:1}
      .task-actions{display:flex;gap:8px}
      .icon-btn{background:transparent;border:1px solid transparent;padding:6px;border-radius:8px;cursor:pointer}
      .small-muted{font-size:13px;color:#6b7280}
      @media (max-width:520px){.header{flex-direction:column;align-items:stretch}.input-row{flex-direction:column}.add-btn{width:100%}}
    `;
    const style = document.createElement('style');
    style.id = 'todo-app-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }, []);

  function addTask(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTask = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    setInput('');
  }

  function toggleComplete(id) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed));
  }

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="todo-root">
      <div className="card">
        <div className="header">
          <div>
            <div className="title">To‑Do List</div>
            <div className="small-muted">Simple React app — add, complete, delete. Data persists in localStorage.</div>
          </div>

          <div className="filters" role="tablist" aria-label="Filters">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Incompleted</button>
            <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
        </div>

        <form onSubmit={addTask} className="input-row">
          <input
            className="text-input"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            aria-label="New task"
          />
          <button className="add-btn" type="submit" disabled={!input.trim()}>Add</button>
        </form>

        <div className="list" aria-live="polite">
          {filtered.length === 0 ? (
            <div className="small-muted" style={{incomplete:12}}>No tasks here — try adding one!</div>
          ) : (
            filtered.map(task => (
              <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                <label style={{display:'flex',alignItems:'center',gap:12,width:'100%'}}>
                  <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} aria-label={`Mark ${task.text} complete`} />
                  <div className="task-label">{task.text}</div>
                </label>

                <div className="task-actions">
                  <button className="icon-btn" onClick={() => toggleComplete(task.id)} aria-label="toggle">
                    {task.completed ? 'Undo' : 'Done'}
                  </button>
                  <button className="icon-btn" onClick={() => deleteTask(task.id)} aria-label="delete">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
          <div className="small-muted">{tasks.filter(t => !t.completed).length} incomplete</div>
          <div style={{display:'flex',gap:8}}>
            <button className="filter-btn" onClick={() => setTasks([])} title="Remove all tasks">Clear All</button>
            <button className="filter-btn" onClick={clearCompleted} title="Remove completed tasks">Clear Completed</button>
          </div>
        </div>
      </div>
    </div>
  );
}
