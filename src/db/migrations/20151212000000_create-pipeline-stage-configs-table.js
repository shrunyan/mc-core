'use strict'

exports.up = function (knex, Promise) {

  return knex.schema.createTable('pipeline_stage_configs', function (table) {
    table.increments()
    table.integer('pipeline_config_id')
    table.integer('sort')
    table.string('type')
    table.timestamp('options').nullable()
    table.timestamp('created_at').nullable()
    table.timestamp('updated_at').nullable()
  })

}

exports.down = function (knex, Promise) {

  return knex.schema.dropTable('pipeline_stage_configs')

}

