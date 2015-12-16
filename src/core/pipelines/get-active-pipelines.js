'use strict'

let connection = require('../../db/connection')

module.exports = (callback) => {

  connection.select()
    .orderBy('finished_at', 'desc')
    .whereNull('finished_at')
    .from('pipeline_executions')
    .then((rows) => {
      callback(rows)
    })

}
