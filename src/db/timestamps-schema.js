module.exports = (knex, table) => {
  // These must be in this order and be set before
  // any other timestamps to ensure `updated_at`
  // is set with `on update CURRENT_TIMESTAMP`
  // TODO file a bug? could be solved here; https://github.com/tgriesser/knex/issues/547
  table.timestamp('updated_at').notNullable()
  table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
}
