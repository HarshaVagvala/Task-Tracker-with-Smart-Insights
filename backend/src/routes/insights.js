const express = require('express');
const router = express.Router();
const knex = require('../db');
const { VALID_PRIORITIES } = require('../validation');
const { DateTime } = require('luxon'); // optional; if not installed use plain JS

// GET /insights -> compute summary
router.get('/', async (req, res) => {
  try {
    // 1. counts by priority
    const byPriority = {};
    const rowsPriority = await knex('tasks').select('priority').count('id as count').groupBy('priority');
    VALID_PRIORITIES.forEach(p => byPriority[p] = 0);
    rowsPriority.forEach(r => { byPriority[r.priority] = r.count; });

    // 2. counts by status
    const rowsStatus = await knex('tasks').select('status').count('id as count').groupBy('status');
    const byStatus = {};
    rowsStatus.forEach(r => { byStatus[r.status] = r.count; });

    // 3. due soon count (next 7 days)
    const today = new Date();
    const in7 = new Date();
    in7.setDate(today.getDate() + 7);
    const dueSoonRows = await knex('tasks')
      .whereNotNull('due_date')
      .andWhere('due_date', '>=', today.toISOString().slice(0,10))
      .andWhere('due_date', '<=', in7.toISOString().slice(0,10))
      .count('id as count');
    const dueSoon = dueSoonRows[0].count || 0;

    // 4. busiest day (by due_date) in the next 14 days or overall
    const busiestRows = await knex('tasks')
      .whereNotNull('due_date')
      .select('due_date')
      .count('id as count')
      .groupBy('due_date')
      .orderBy('count', 'desc')
      .limit(1);
    const busiest = busiestRows.length ? { due_date: busiestRows[0].due_date, count: busiestRows[0].count } : null;

    // Build a friendly rule-based summary string:
    // find which priority dominates
    const totalTasksRow = await knex('tasks').count('id as cnt');
    const totalTasks = totalTasksRow[0].cnt || 0;
    // find top priority
    let topPriority = null;
    let topCount = 0;
    Object.entries(byPriority).forEach(([p,c]) => {
      if (c > topCount) { topPriority = p; topCount = c; }
    });

    const summaryParts = [];
    summaryParts.push(`You have ${totalTasks} task${totalTasks!==1?'s':''}.`);
    if (topPriority) summaryParts.push(`Most tasks are ${topPriority.toUpperCase()} priority (${topCount}).`);
    if (dueSoon > 0) summaryParts.push(`${dueSoon} task${dueSoon!==1?'s':''} due within the next 7 days.`);
    if (busiest) summaryParts.push(`Busiest due date: ${busiest.due_date} (${busiest.count} tasks).`);

    const summary = summaryParts.join(' ');

    return res.json({
      data: {
        byPriority,
        byStatus,
        dueSoon: Number(dueSoon),
        busiest,
        summary
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error', details: err.message });
  }
});

module.exports = router;
