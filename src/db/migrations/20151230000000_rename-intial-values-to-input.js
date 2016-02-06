'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.table('pipeline_executions', function(table) {
    table.renameColumn('initial_values', 'input')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.table('pipeline_executions', function(table) {
    table.renameColumn('input', 'initial_values')
  })

}
