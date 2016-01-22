'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

function copyStageConfigs(targetPipelineId, sourcePipelineId) {
  return new Promise((resolve, reject) => {

    connection
      .table('pipeline_stage_configs')
      .where('pipeline_config_id', sourcePipelineId)
      .select()
      .catch((err) => {
        logger.error(err)
        reject()
      })
      .then(items => {

        if (items.length === 0) {
          resolve()
          return
        }

        items.forEach((item) => {
          delete item.id
          item.pipeline_config_id = targetPipelineId
          item.created_at = item.updated_at = new Date()
        })

        connection
          .insert(items)
          .into('pipeline_stage_configs')
          .catch((err) => {
            logger.error(err)
            reject()
          })
          .then(() => {
            resolve()
          })
      })

  })
}

function copyVariables(targetPipelineId, sourcePipelineId) {
  return new Promise((resolve, reject) => {

    connection
      .table('pipeline_variables')
      .where('pipeline_config_id', sourcePipelineId)
      .select()
      .catch((err) => {
        logger.error(err)
        reject()
      })
      .then(items => {

        if (items.length === 0) {
          resolve()
          return
        }

        items.forEach((item) => {
          delete item.id
          item.pipeline_config_id = targetPipelineId
          item.created_at = item.updated_at = new Date()
        })

        connection
          .insert(items)
          .into('pipeline_variables')
          .catch((err) => {
            logger.error(err)
            reject()
          })
          .then(() => {
            resolve()
          })
      })

  })
}

module.exports = function(targetPipelineId, sourcePipelineId) {
  return Promise.all([
    copyStageConfigs(targetPipelineId, sourcePipelineId),
    copyVariables(targetPipelineId, sourcePipelineId)
  ])
}
