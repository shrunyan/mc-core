'use strict'

exports.up = function (knex, Promise) {

  return knex.schema.createTable('projects', function (table) {
    table.increments()
    table.string('name')
    table.timestamp('created_at').nullable()
    table.timestamp('updated_at').nullable()
  })

}

exports.down = function (knex, Promise) {

  return knex.schema.dropTable('projects')

}
