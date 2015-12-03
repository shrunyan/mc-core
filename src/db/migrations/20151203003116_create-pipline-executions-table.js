'use strict'

exports.up = function (knex, Promise) {

  return knex.schema.createTable('pipeline_executions', function (table) {
    table.increments()
    table.integer('pipeline_id')
    table.string('status') // Should be one of "queued", "running", "failed", "succeeded"
    table.timestamp('started_at').nullable()
    table.timestamp('finished_at').nullable()
    table.timestamp('created_at').nullable()
    table.timestamp('updated_at').nullable()
  })

}

exports.down = function (knex, Promise) {

  return knex.schema.dropTable('pipeline_executions')

}
