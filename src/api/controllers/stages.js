'use strict'

let logger = require('tracer').colorConsole()
let registry = require('../../extensions/registry')
let basic = require('./basic-response-helper')
let connection = require('../../db/connection')

module.exports = {

  setStageConfig: function setStageConfig(req, res) {
    basic.insertRespond(req, res, 'pipeline_stage_configs')
  },

  updateStageConfig: function updateStageConfig(req, res) {
    basic.patchRespond(req, res, 'pipeline_stage_configs')
  },

  deleteStageConfig: function deleteStageConfig(req, res) {
    basic.deleteRespond(req, res, 'pipeline_stage_configs')
  },

  getAvailableTypes: function getAvailableTypes(req, res) {
    res.status(201).send({data: registry.getStageTypes()})
  },

  /**
   * Get stages for a specific pipeline
   *
   * @param req
   * @param res
   */
  getListForPipeline: function getListForPipeline(req, res) {
    connection
      .table('pipeline_stage_configs')
      .where('pipeline_config_id', req.params.id)
      .then(items => {
        res.status(200).send({
          data: items.map(item => {
            item.options = JSON.parse(item.options)
            return item
          })
        })
      })
      .catch(err => logger.error(err))
  }

}
