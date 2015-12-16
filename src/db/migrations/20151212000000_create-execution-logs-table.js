'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_execution_logs', function(table) {
    table.increments()
    table.integer('pipeline_execution_id')
    table.integer('stage_execution_id')
    table.integer('stage_num')
    table.timestamp('logged_at').nullable()
    table.string('type')
    table.string('title')
    table.text('data')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_execution_logs')

}

