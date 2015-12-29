'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.table('pipeline_stage_configs', function(table) {
    table.text('output_mapping')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.table('pipeline_stage_configs', function(table) {
    table.dropColumn('output_mapping')
  })

}
