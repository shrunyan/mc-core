'use strict'

module.exports = (msg, next, msgid) => {

    // process your message
    logger.debug('message received. ID: ' + msgid)
    logger.debug(msg)

    // TODO: validate the incoming job data

    // TODO: look up the pipeline execution
    
    // TODO: mark the pipeline as successful

    // Mark the queue job as complete, and move onto the next
    next()

}