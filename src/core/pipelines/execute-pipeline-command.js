'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let snapshot = require('./config-snapshot-builder')
let pipelineEvent = require('../../queues/pipeline/events')
let queue = require('../../queues/queue')('pipeline_executions')

let state = {
  pipelineId: null,
  userId: null,
  params: null,
  callback: null
}

function getConfig() {
  return connection
    .first()
    .where('id', state.pipelineId)
    .from('pipeline_configs')
    .then(config => {
      state.config = config
    })
    .catch(err => logger.error(err))
}

function getSnapshot() {
  return snapshot(state.pipelineId, (snapshot) => {
    state.snapshot = snapshot
    state.execData = {
      pipeline_config_id: state.pipelineId,
      pipeline_config_name: state.config.name,
      owner_id: state.userId,
      status: 'created',
      created_at: new Date(),
      updated_at: new Date(),
      input: JSON.stringify(state.params),
      config_snapshot: JSON.stringify(snapshot)
    }
  })
}

function createPipelineExecRecord() {
  // Create pipeline execution entry in DB
  return connection
    .insert(state.execData, 'id')
    .into('pipeline_executions')
    .then(id => {
      state.execId = id[0]

      // Notify whoever invoked this command
      state.callback(id[0])
    })
    .catch(err => logger.error(err))
}

// Send message to queue to handle new execution
function queueExec() {
  queue.sendMessage({
    qname: 'pipeline_executions',
    message: JSON.stringify({
      id: state.execId,
      type: 'pipeline_execution'
    })
  }, (err, resp) => {
    if (err) {
      logger.error(err)
      throw err
    }

    // Mark new execution as queued (using the id captured above)
    connection('pipeline_executions')
      .where('id', state.execId)
      .update('status', 'queued')
      .catch(err => logger.error(err))

    // Publish a pipeline update event
    pipelineEvent('update')

  })
}

module.exports = (function() {
 /**
  * [command Creates a new pipeline execution, and queues it for processing.]
  * @param pipelineId
  * @param input
  * @param userId
  * @param callback
  */
  return function command(pipelineId, params, userId, callback) {
    state.pipelineId = pipelineId
    state.userId = userId
    state.params = params || {}
    state.callback = callback

    getConfig()
      .then(getSnapshot)
      .then(createPipelineExecRecord)
      .then(pipelineEvent('update'))
      .then(queueExec)
      .then(() => logger.log('Completed pipeline execution command'))
      .catch(err => logger.error(err))
  }
}())
