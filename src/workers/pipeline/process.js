'use strict'

let logger = require('tracer').colorConsole()
let connection = require('../../db/connection')
let message = require('../message')
let job = require('./job')

const TABLE = 'pipeline_executions'

let state = {
  msg: null,
  config: null
}

// function load(id) {
//   return connection
//     .table(TABLE)
//     .where('id', id)
//     .first()
//     .then(pipeline => {
//       state.config = JSON.parse(pipeline.config_snapshot)
//     })
//     .catch(err => logger.error(err))
// }

function Process(msg, next) {
  state.msg = message(msg)

  // load data for msg ID
  this.load(state.msg.id)
    .then(() => {
      // mark as running
    })
    .then(() => {
      // start job for each stage
      state.config.stageConfigs.forEach(stage => {
        job(msg, stage)
      })
    })
    .then(() => {
      // mark as completed
    })
    .then(next)
}

Process.prototype = {
  load: function(id) {
    return connection
      .table(TABLE)
      .where('id', id)
      .first()
      .then(pipeline => {
        state.config = JSON.parse(pipeline.config_snapshot)
      })
      .catch(err => logger.error(err))
  }
}


module.exports = new Process()

// module.exports = new Process()

// module.exports = (msg, next) => {
//   // Parse the JSON in the message
//   msg = JSON.parse(msg)

//   // Validate the incoming job data
//   if (!msg.pipeline_execution_id) {
//     logger.error('a queue job was submitted to pipeline_executions, but with no pipeline_execution_id')
//   } else {

//     console.log('Message', msg)

//     // load data

//     // job({
//     //   id: msg.pipeline_execution_id,
//     //   cb: next,
//     //   table: 'pipeline_executions'
//     // })

//     // console.log('JOB', job)
//     // new Job(msg.pipeline_execution_id, next)
//   }
// }
