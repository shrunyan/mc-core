'use strict'

const PIPELINE_UPDATES_QUEUE = 'pipeline_updates'

let logger = require('tracer').colorConsole()
let queue = require('../queue')(PIPELINE_UPDATES_QUEUE)

module.exports = (eventName) => {
  function handleResponse(err, res) {
    if (err) {
      logger.error(err)
      throw err
    }
    logger.log(res)
  }

  // TODO: consider buffering/grouping this event so
  // we don't flood event updates unnecessarily
  switch (eventName) {
    case 'update':
      queue.sendMessage({
        qname: PIPELINE_UPDATES_QUEUE,
        message: ''
      }, handleResponse)
      break
  }
}
