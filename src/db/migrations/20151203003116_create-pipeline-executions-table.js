'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_executions', function(table) {
    table.increments()
    table.integer('pipeline_config_id')
    table.string('pipeline_config_name')
    table.integer('owner_id')
    table.string('status') // Should be either "created", "queued", "running", "awaiting_confirmation", "failed", "succeeded"
    table.timestamp('updated_at').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('started_at').nullable()
    table.timestamp('finished_at').nullable()
    table.text('initial_values')
    table.text('config_snapshot')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_executions')

}
