import React from 'react';

export default function TaskList({ tasks=[], onUpdated, apiBase }) {
  const update = async (id, patch) => {
    const r = await fetch(`${apiBase}/tasks/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(patch)
    });
    if (r.ok) onUpdated();
    else {
      const j = await r.json();
      alert('Error updating: ' + JSON.stringify(j));
    }
  };

  return (
    <div>
      {tasks.length === 0 && <div>No tasks</div>}
      <ul style={{listStyle:'none', padding:0}}>
        {tasks.map(t => (
          <li key={t.id} style={{border:'1px solid #ddd', padding:8, marginBottom:8, borderRadius:6}}>
            <div><strong>{t.title}</strong> <small>({t.priority})</small></div>
            <div>{t.description}</div>
            <div>Due: {t.due_date || '—'}</div>
            <div>
              <select value={t.status} onChange={(e)=>update(t.id, { status: e.target.value })}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <button onClick={()=>update(t.id, { priority: t.priority === 'high' ? 'medium' : 'high' })} style={{marginLeft:8}}>
                Toggle priority
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
