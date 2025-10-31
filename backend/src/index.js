const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const insightsRouter = require('./routes/insights');
const knex = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/tasks', tasksRouter);
app.use('/insights', insightsRouter);

// health
app.get('/', (req,res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on ${port}`);
});
