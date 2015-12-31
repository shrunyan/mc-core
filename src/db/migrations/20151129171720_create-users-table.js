'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function(table) {
    table.increments()
    table.string('email')
    table.string('password')
    table.string('first_name')
    table.string('last_name')

    // These must be in this order and be set before
    // any other timestamps to ensure `updated_at`
    // is set with `on update CURRENT_TIMESTAMP`
    // TODO file a bug? could be solved here; https://github.com/tgriesser/knex/issues/547
    table.timestamp('updated_at').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('users')

}
