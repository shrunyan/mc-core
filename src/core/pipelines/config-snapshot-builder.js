'use strict'

/**
 * Returns an aggregate object for a full pipeline configuration snapshot. Includes:
 * - initial variable values
 * - stages
 * - stage configuration values
 *
 * Ultimately, this is used to execute a pipeline and its stages
 *
 * @param id
 */
module.exports = function(id) {

  // TODO: load pipeline

  // inject initial variables value

  // TODO: inject stages (with config)

  return {
    stages: [
      {
        id: 1
      }
    ]
  }

}