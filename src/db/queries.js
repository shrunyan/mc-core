'use strict'

let connection = require('./connection')
let parseParams = require('../api/utils/parse-params')

module.exports = {

  all: (table) => {
    return connection
      .table(table)
      .select()
  },

  patch: (id, data, table) => {
    return connection
      .table(table)
      .where('id', id)
      .update(parseParams(data))
  },

  first: (id, table) => {
    return connection.first()
      .where('id', id)
      .from(table)
  },

  remove: (id, table) => {
    return connection
      .table(table)
      .where('id', id)
      .del()
  },

  where: (filter, column, table) => {
    return connection
      .table(table)
      .where(column, filter)
  },

  insert: (data, table) => {
    // Protect the ID field by not allowing
    // the user to specify one
    delete data.id
    return connection
      .table(table)
      .insert(parseParams(data), 'id')
  }

}
