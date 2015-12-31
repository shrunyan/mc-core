'use strict'

let timestamps = require('../timestamps-schema')

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_configs', function(table) {
    table.increments()
    table.integer('project_id')
    table.string('name')
    timestamps(knex, table)
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_configs')

}
