const express = require('express');
const router = express.Router();
const knex = require('../db');
const { validateNewTask } = require('../validation');

// POST /tasks -> add task
router.post('/', async (req, res) => {
  try {
    const errors = validateNewTask(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const { title, description, priority='medium', status='todo', due_date=null } = req.body;
    const [id] = await knex('tasks').insert({ title, description, priority, status, due_date });
    const task = await knex('tasks').where({ id }).first();
    return res.status(201).json({ data: task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// GET /tasks -> list tasks, support ?status=&priority=&sort=due_date|created_at&order=asc|desc
router.get('/', async (req, res) => {
  try {
    const { status, priority, sort='due_date', order='asc' } = req.query;
    let q = knex('tasks');
    if (status) q = q.where('status', status);
    if (priority) q = q.where('priority', priority);
    // allow safe sorts
    const allowedSort = ['due_date','created_at','priority','id'];
    const s = allowedSort.includes(sort) ? sort : 'due_date';
    const o = order === 'desc' ? 'desc' : 'asc';
    q = q.orderBy(s, o);
    const tasks = await q.select();
    return res.json({ data: tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

// PATCH /tasks/:id -> update status or priority (or other fields)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};
    const updatable = ['status','priority','title','description','due_date'];
    updatable.forEach(k => { if (req.body[k] !== undefined) payload[k] = req.body[k]; });
    if (Object.keys(payload).length === 0) return res.status(400).json({ error: 'nothing_to_update' });

    payload.updated_at = knex.fn.now();
    const updated = await knex('tasks').where({ id }).update(payload);
    if (!updated) return res.status(404).json({ error: 'not_found' });
    const task = await knex('tasks').where({ id }).first();
    return res.json({ data: task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
