'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_variables', function(table) {
    table.increments()
    table.timestamp('updated_at').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.integer('pipeline_config_id')
    table.string('name')
    table.text('description')
    table.boolean('required')
    table.string('default_value')
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_variables')

}
