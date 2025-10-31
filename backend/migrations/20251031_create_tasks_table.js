/**
 * Knex migration: create tasks table
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.enu('priority', ['low', 'medium', 'high']).notNullable().defaultTo('medium');
    table.enu('status', ['todo', 'in-progress', 'done']).notNullable().defaultTo('todo');
    table.date('due_date').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    // Indexes
    table.index(['priority']);
    table.index(['status']);
    table.index(['due_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks');
};
