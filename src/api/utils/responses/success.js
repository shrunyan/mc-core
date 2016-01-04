'use strict'

let logger = require('tracer').colorConsole()

/**
 * By binding your Express `res` object
 * to this function we can create a consistant
 * way to handle 200 responses.
 * @param  {Multi} data Value to be sent to request
 */
module.exports = function(data) {
  logger.debug(data)
  this.status(200).send({data})
}
