'use strict'

/**
 * Mock for the 'connection' module
 * @type {Object}
 */
let tracer = {
  colorConsole: () => tracer,
  log: (cb) => {},
  error: (cb) => {}
}

module.exports = tracer
