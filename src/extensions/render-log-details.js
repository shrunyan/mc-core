'use strict'

let registry = require('./registry')

module.exports = (logs) => {
  logs.forEach(function(log) {
    if (log.type !== null) {

      let logType = registry.get(log.type)

      log.details = logType.renderDetails(JSON.parse(log.data))

    }
  })

  return logs
}
