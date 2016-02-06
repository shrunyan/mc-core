'use strict'

let timestamps = require('../timestamps-schema')

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_stage_configs', function(table) {
    table.increments()
    table.integer('pipeline_config_id')
    table.integer('sort').default(99999)
    table.string('type')
    table.string('name')
    table.text('options')
    timestamps(knex, table)
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_stage_configs')

}
