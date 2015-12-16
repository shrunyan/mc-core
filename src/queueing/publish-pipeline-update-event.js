'use strict'

let pipelineUpdatesQueue = require('./pipeline-updates-queue')

module.exports = () => {
  pipelineUpdatesQueue.sendMessage({qname: 'pipeline_updates', message: ''}, function(err, resp) {

    if (resp) {
      console.log('RSMQ "pipeline_updates" message sent. ID:', resp)
    }

    if (err) {
      console.error(err)
      throw err
    }

  })

}