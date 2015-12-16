'use strict'

let connection = require('../../db/connection')

module.exports = (callback) => {

  connection.select()
    .orderBy('created_at', 'asc')
    .whereNull('finished_at')
    .from('pipeline_executions')
    .then((rows) => {
      callback(rows)
    })

}
