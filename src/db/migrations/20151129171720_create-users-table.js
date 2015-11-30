exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments()
    table.string('name')
    table.timestamp('created_at')
    table.timestamp('updated_at')
  })
}

exports.down = function (knex, Promise) {
  knex.schema.dropTable('users')
}
