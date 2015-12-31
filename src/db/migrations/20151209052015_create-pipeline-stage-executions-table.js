'use strict'

let timestamps = require('../timestamps-schema')

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_stage_executions', function(table) {
    table.increments()
    table.integer('pipeline_execution_id')
    table.integer('stage_config_id')
    table.integer('stage_num')
    table.string('status') // Should be either "created", "running", "awaiting_confirmation", "failed", "succeeded", "skipped"
    timestamps(knex, table)
    table.timestamp('started_at').nullable()
    table.timestamp('finished_at').nullable()
    table.timestamp('skipped_at').nullable()
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_stage_executions')

}
