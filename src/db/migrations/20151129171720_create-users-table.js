'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function(table) {
    table.increments()
    table.string('email')
    table.string('password')
    table.string('first_name')
    table.string('last_name')
    table.timestamp('created_at').nullable()
    table.timestamp('updated_at').nullable()
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('users')

}
