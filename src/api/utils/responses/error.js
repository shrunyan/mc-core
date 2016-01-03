'use strict'

let logger = require('tracer').colorConsole()

module.exports = function(err) {
  logger.error('Database Error | ', err)

  this.status(500).send({
    message: 'An error occurred.'
  })
}
