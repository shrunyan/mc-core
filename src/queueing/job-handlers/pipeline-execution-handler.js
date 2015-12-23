'use strict'

let logger = require('tracer').colorConsole()
let PipelineExecutor = require('../../core/pipelines/pipeline-executor')

module.exports = (msg, next) => {
  logger.debug(msg)

  // Parse the JSON in the message
  msg = JSON.parse(msg)

  // Validate the incoming job data
  if (!msg.pipeline_execution_id) {
    logger.error('a queue job was submitted to pipeline_executions, but with no pipeline_execution_id')
  } else {
    new PipelineExecutor(msg.pipeline_execution_id, next)
  }

}
