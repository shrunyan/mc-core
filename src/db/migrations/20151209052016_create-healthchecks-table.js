'use strict'

let timestamps = require('../timestamps-schema')

exports.up = function(knex, Promise) {
  return knex.schema.createTable('health_checks', function(table) {
    table.increments()
    table.integer('project_id')
    table.string('name')
    timestamps(knex, table)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('health_checks')
}
