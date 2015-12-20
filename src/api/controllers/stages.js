'use strict'

let pkgs = require('../../extensions/registry').load()
let basic = require('./basic-response-helper')

module.exports = {

  getAvailableTypes: function getAvailableTypes(req, res) {
    let stages = []

    for (let vendor in pkgs) {
      for (let ext in pkgs[vendor]) {
        for (let stage in pkgs[vendor][ext].stages) {
          stages.push({
            id: [vendor, ext, stage].join('.'),
            name: stage
          })
        }
      }
    }

    res.status(201).send({data: stages})
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
