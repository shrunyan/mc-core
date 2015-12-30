'use strict'

let logger = require('tracer').colorConsole()
let connection = require('../db/connection')

module.exports = function status(id, status, table) {
  let data = {
    status: status,
    updated_at: new Date()
  }

  switch (status) {
    case 'running':
      data.started_at = new Date()
      break
    case 'failed':
    case 'succeeded':
      data.finished_at = new Date()
      break
  }

  // Returns a promise
  return connection
    .table(table)
    .where('id', id)
    .update(data)
    .catch(err => logger.error(err))
}
