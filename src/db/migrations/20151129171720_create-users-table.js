'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function(table) {
    table.increments()
    table.string('email')
    table.string('password')
    table.string('first_name')
    table.string('last_name')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().onUpdate(knex.fn.now())
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('users')

}
