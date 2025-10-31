import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import InsightsPanel from './components/InsightsPanel';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function App(){
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState(null);
  const [filter, setFilter] = useState({status:'',priority:''});

  const fetchTasks = async () => {
    let url = `${API}/tasks`;
    const qs = [];
    if (filter.status) qs.push('status=' + encodeURIComponent(filter.status));
    if (filter.priority) qs.push('priority=' + encodeURIComponent(filter.priority));
    if (qs.length) url += '?' + qs.join('&');
    const r = await fetch(url);
    const j = await r.json();
    setTasks(j.data || []);
  };

  const fetchInsights = async () => {
    const r = await fetch(`${API}/insights`);
    const j = await r.json();
    setInsights(j.data);
  };

  useEffect(() => { fetchTasks(); fetchInsights(); }, [filter]);

  return (
    <div style={{ maxWidth: 900, margin: 20 }}>
      <h1>Task Tracker (mini)</h1>
      <TaskForm onAdded={() => { fetchTasks(); fetchInsights(); }} apiBase={API} />
      <hr/>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h3>Tasks</h3>
          <div style={{marginBottom:8}}>
            <label>Status:
              <select onChange={e=>setFilter(f=>({...f,status:e.target.value}))} value={filter.status}>
                <option value="">All</option>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label style={{marginLeft:12}}>Priority:
              <select onChange={e=>setFilter(f=>({...f,priority:e.target.value}))} value={filter.priority}>
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <TaskList tasks={tasks} onUpdated={()=>{ fetchTasks(); fetchInsights(); }} apiBase={API} />
        </div>
        <div style={{width:320}}>
          <InsightsPanel insights={insights} />
        </div>
      </div>
    </div>
  );
}
