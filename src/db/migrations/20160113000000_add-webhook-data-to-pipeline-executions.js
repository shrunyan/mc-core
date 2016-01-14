'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.table('pipeline_executions', function(table) {
    table.text('webhook_data')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.table('pipeline_executions', function(table) {
    table.dropColumn('webhook_data')
  })

}
