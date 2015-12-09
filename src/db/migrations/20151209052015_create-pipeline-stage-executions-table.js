'use strict'

exports.up = function (knex, Promise) {

    return knex.schema.createTable('pipeline_stage_executions', function (table) {
        table.increments()
        table.integer('pipeline_id')
        table.integer('stage_id')
        table.integer('stage_num')
        table.integer('stage_name')
        table.string('status') // Should be either "created", "running", "awaiting_confirmation", "failed", "succeeded", "skipped"
        table.timestamp('started_at').nullable()
        table.timestamp('finished_at').nullable()
        table.timestamp('skipped_at').nullable()
        table.timestamp('created_at').nullable()
        table.timestamp('updated_at').nullable()
        //table.text('initial_values')
        //table.text('config_snapshot')
    })

}

exports.down = function (knex, Promise) {

    return knex.schema.dropTable('pipeline_stage_executions')

}
