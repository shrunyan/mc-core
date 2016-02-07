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
 * - pipeline variables configuration
 *
 * Ultimately, this is used to execute a pipeline and its stages.
 *
 * @param {int|string} pipelineId
 * @param {function} callback
 */
module.exports = function snapshot(pipelineId, callback) {

  let snapshot = {}
  let promises = []

  // Load pipeline
  promises.push(new Promise((resolve, reject) => {

    connection.first().where('id', pipelineId).from('pipeline_configs').then((pipeline) => {

      snapshot.pipeline = pipeline
      resolve()

    }).catch(err => {
      logger.error(err)
      reject()
    })

  }))

  // Load stages
  promises.push(new Promise((resolve, reject) => {

    connection.select().where('pipeline_config_id', pipelineId).orderBy('sort').from('pipeline_stage_configs').then((rows) => {

      snapshot.stageConfigs = rows
      resolve()

    }).catch(err => {
      logger.error(err)
      reject()
    })

  }))

  // Load variables
  promises.push(new Promise((resolve, reject) => {

    connection.select().where('pipeline_config_id', pipelineId).from('pipeline_variables').then((rows) => {

      snapshot.variables = rows
      resolve()

    }).catch(err => {
      logger.error(err)
      reject()
    })

  }))

  return Promise.all(promises).then(() => callback(snapshot))
}
