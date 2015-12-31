'use strict'

let logger = require('tracer').colorConsole()
let connection = require('../db/connection')

/**
 * Handles updating statuses for pipeline executions and stage executions
 * @param id
 * @param status
 * @param table
 * @returns {Promise}
 */
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
  return new Promise((resolve) => {
    connection
      .table(table)
      .where('id', id)
      .update(data)
      .catch(err => logger.error(err))
      .then(() => resolve())
  })
}
