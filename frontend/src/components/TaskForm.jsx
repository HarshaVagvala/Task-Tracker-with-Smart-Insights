import React, { useState } from 'react';

export default function TaskForm({ onAdded, apiBase }){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const body = { title, description, priority, due_date: dueDate || null };
    const r = await fetch(`${apiBase}/tasks`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    if (r.ok) {
      setTitle(''); setDescription(''); setDueDate('');
      if (onAdded) onAdded();
    } else {
      const j = await r.json();
      alert('Error: ' + JSON.stringify(j));
    }
  };

  return (
    <form onSubmit={submit} style={{display:'grid', gap:8}}>
      <h3>Add Task</h3>
      <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <textarea placeholder="description" value={description} onChange={e=>setDescription(e.target.value)} />
      <div>
        <label>Priority:
          <select value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label style={{marginLeft:12}}>Due date:
          <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        </label>
        <button style={{marginLeft:12}} type="submit">Add</button>
      </div>
    </form>
  );
}
