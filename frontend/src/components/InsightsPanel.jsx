import React from 'react';

export default function InsightsPanel({ insights }) {
  if (!insights) return <div>Loading insights...</div>;
  const { byPriority, byStatus, dueSoon, busiest, summary } = insights;
  return (
    <div style={{border:'1px solid #ddd', padding:12, borderRadius:8}}>
      <h3>Insights</h3>
      <div><strong>Summary:</strong> {summary}</div>
      <div style={{marginTop:8}}>
        <div><strong>By priority:</strong></div>
        <ul>
          <li>High: {byPriority.high}</li>
          <li>Medium: {byPriority.medium}</li>
          <li>Low: {byPriority.low}</li>
        </ul>
        <div><strong>Due soon (7d):</strong> {dueSoon}</div>
        {busiest && <div><strong>Busiest day:</strong> {busiest.due_date} ({busiest.count})</div>}
      </div>
    </div>
  );
}
