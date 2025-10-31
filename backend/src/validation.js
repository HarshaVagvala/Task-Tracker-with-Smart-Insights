const VALID_PRIORITIES = ['low','medium','high'];
const VALID_STATUS = ['todo','in-progress','done'];

function validateNewTask(body) {
  const errors = [];
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    errors.push('title is required');
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    errors.push('priority must be one of ' + VALID_PRIORITIES.join(','));
  }
  if (body.status && !VALID_STATUS.includes(body.status)) {
    errors.push('status must be one of ' + VALID_STATUS.join(','));
  }
  // due_date optional; if present validate YYYY-MM-DD roughly
  if (body.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(body.due_date)) {
    errors.push('due_date must be YYYY-MM-DD');
  }
  return errors;
}

module.exports = { validateNewTask, VALID_PRIORITIES, VALID_STATUS };
