'use strict'

const PIPELINE_STAGE_CONFIGS = 'pipeline_stage_configs'
const PIPELINE_CONFIG_ID = 'pipeline_config_id'

let registry = require('../../extensions/registry')
let query = require('../../db/queries')
let success = require('../utils/responses/success')
let error = require('../utils/responses/error')

module.exports = {

  setStageConfig: function setStageConfig(req, res) {
    // Prevent null for stages options/outputmap
    req.body.options = req.body.options || {}
    req.body.output_map = req.body.output_map || {}

    query.insert(req.body, PIPELINE_STAGE_CONFIGS)
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  updateStageConfig: function updateStageConfig(req, res) {
    delete req.body.id

    query.patch(req.params.id, req.body, PIPELINE_STAGE_CONFIGS)
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  deleteStageConfig: function deleteStageConfig(req, res) {
    query.remove(req.params.id, PIPELINE_STAGE_CONFIGS)
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  getAvailableTypes: function getAvailableTypes(req, res) {
    success.call(res, registry.getStageTypes())
  },

  /**
   * Get stages for a specific pipeline
   *
   * @param req
   * @param res
   */
  getListForPipeline: function getListForPipeline(req, res) {
    query.where(req.params.id, PIPELINE_CONFIG_ID, PIPELINE_STAGE_CONFIGS)
      .then(items => {

        let data = items.map(item => {
          item.output_map = JSON.parse(item.output_map)
          item.options = JSON.parse(item.options)
          return item
        })

        success.call(res, data)
      })
      .catch(error.bind(res))
  }

}
