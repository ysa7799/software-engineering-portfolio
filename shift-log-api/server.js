// Shift Log REST API — Node.js + Express, in-memory store (no DB needed to run).
// Models a security/operations shift-log: create, read, update, delete incident entries.
const express = require('express');
const app = express();
app.use(express.json());

let logs = [];
let nextId = 1;
const CATEGORIES = ['Access Control','Alarm Response','Patrol Finding','Equipment Fault','Visitor Incident'];

function validate(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string') errors.push('title is required');
  if (!CATEGORIES.includes(body.category)) errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
  if (body.priority && !['low','medium','high'].includes(body.priority)) errors.push('priority must be low|medium|high');
  return errors;
}

app.get('/health', (_req, res) => res.json({ status: 'ok', count: logs.length }));

app.get('/api/logs', (req, res) => {
  let result = logs;
  if (req.query.category) result = result.filter(l => l.category === req.query.category);
  if (req.query.priority) result = result.filter(l => l.priority === req.query.priority);
  res.json(result);
});

app.get('/api/logs/:id', (req, res) => {
  const log = logs.find(l => l.id === Number(req.params.id));
  if (!log) return res.status(404).json({ error: 'not found' });
  res.json(log);
});

app.post('/api/logs', (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const log = {
    id: nextId++,
    title: req.body.title,
    category: req.body.category,
    priority: req.body.priority || 'medium',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString()
  };
  logs.push(log);
  res.status(201).json(log);
});

app.put('/api/logs/:id', (req, res) => {
  const log = logs.find(l => l.id === Number(req.params.id));
  if (!log) return res.status(404).json({ error: 'not found' });
  const errors = validate({ ...log, ...req.body });
  if (errors.length) return res.status(400).json({ errors });
  Object.assign(log, req.body, { id: log.id });
  res.json(log);
});

app.delete('/api/logs/:id', (req, res) => {
  const i = logs.findIndex(l => l.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'not found' });
  const [removed] = logs.splice(i, 1);
  res.json(removed);
});

// reset helper for tests
app._reset = () => { logs = []; nextId = 1; };

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`Shift Log API on :${PORT}`));
module.exports = app;
