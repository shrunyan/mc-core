'use strict'

module.exports = function() {
  this.status(404).send({
    message: 'Resource not found'
  })
}
