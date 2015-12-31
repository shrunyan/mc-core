'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('health_checks', function(table) {
    table.increments()
    table.integer('project_id')
    table.string('name')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().onUpdate(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('health_checks')
}
