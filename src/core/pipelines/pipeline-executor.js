'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

class PipelineExecutor {

  constructor(pipelineExecutionId, callback) {

    // TODO: look up the pipeline execution

    // Mark the pipeline execution as started
    connection('pipeline_executions')
      .where('id', pipelineExecutionId)
      .update({
        status: 'running',
        started_at: new Date(),
        updated_at: new Date()
      }).catch(err => logger.error(err)).then(() => {

      // TODO: emit event for pipeline_execution update

      // Mark the pipeline_execution as successful
      connection('pipeline_executions')
        .where('id', pipelineExecutionId)
        .update({
          status: 'succeeded',
          finished_at: new Date(),
          updated_at: new Date()
        }).catch(err => logger.error(err)).then(() => {

        // TODO: emit event for pipeline_execution update

        // Mark the queue job as complete, and move onto the next
        callback()

      })

    })

  }

}

module.exports = PipelineExecutor