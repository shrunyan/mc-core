'use strict'

let timestamps = require('../timestamps-schema')

exports.up = function(knex, Promise) {

  return knex.schema.createTable('projects', function(table) {
    table.increments()
    table.string('name')
    timestamps(knex, table)
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('projects')

}
