'use strict'

let logger = require('tracer').colorConsole()

module.exports = function(err) {
  logger.error('Server Error | ', err)

  this.status(500).send({
    message: 'An error occurred.'
  })
}
