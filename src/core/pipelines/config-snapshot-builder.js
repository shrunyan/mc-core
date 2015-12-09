'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

/**
 * Creates an aggregate object for a pipeline configuration snapshot.
 *
 * Includes:
 * - initial variable values
 * - stages
 * - stage configuration values
 *
 * Ultimately, this is used to execute a pipeline and its stages.
 *
 * @param {int|string} pipelineId
 * @param {function} callback
 */
module.exports = function(pipelineId, callback) {

  let snapshot = {}
  let promises = []

  // Load pipeline
  promises.push(new Promise((resolve, reject) => {

    connection.first().where('id', pipelineId).from('pipelines').then((pipeline) => {
      snapshot.pipeline = pipeline
      resolve()
    }).catch(err => {
      logger.error(err)
      reject()
    })

  }))

  // Load stages
  promises.push(new Promise((resolve, reject) => {

    connection.select().where('pipeline_id', pipelineId).from('pipeline_stages').then((rows) => {
      snapshot.stages = rows
      resolve()
    }).catch(err => {
      logger.error(err)
      reject()
    })

  }))


  // inject initial variables value

  // TODO: inject stages (with config)

  Promise.all(promises).then(() => {
    callback(snapshot)
  })
}