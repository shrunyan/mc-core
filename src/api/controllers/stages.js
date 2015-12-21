'use strict'

let registry = require('../../extensions/registry')
let basic = require('./basic-response-helper')

module.exports = {

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

    basic.getListCustom(req, res, 'pipeline_stage_configs', query => {
      return query.where('pipeline_config_id', req.params.id)
    })

  }

}
