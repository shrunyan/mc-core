'use strict'

exports.up = function(knex, Promise) {

  return knex.schema.createTable('pipeline_stage_configs', function(table) {
    table.increments()
    table.integer('pipeline_config_id')
    table.integer('sort').default(99999)
    table.string('type')
    table.string('name')
    table.text('options')
    table.timestamp('created_at').nullable()
    table.timestamp('updated_at').nullable().defaultTo(knex.fn.now())
  })

}

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('pipeline_stage_configs')

}
