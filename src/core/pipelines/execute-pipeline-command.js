'use strict'

let pipelineRsmq = require('../../queueing/pipeline-queue')

module.exports = (pipelineId, input) => {

  input = input || []

  // TODO: snapshot pipeline configuration

  // TODO: create pipeline execution entry in DB

  // TODO: send message to queue to handle new execution
  let message = JSON.stringify({
    pipeline_execution_id: 1
  })
  pipelineRsmq.sendMessage({qname: 'pipeline_executions', message: message}, function (err, resp) {

    if (resp) {

      console.log('Message sent. ID:', resp)

    }

    if (err) {
      throw err
    }

  })

}
