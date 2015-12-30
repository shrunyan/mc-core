'use strict'

let basic = require('./basic-response-helper')

module.exports = {

  getListForPipeline: (req, res) => {
    basic.getListCustom(req, res, 'pipeline_variables', (query) => {
      return query
        .where('pipeline_config_id', req.params.pipeline_id)
        .orderBy('created_at', 'asc')
    })
  },

  createVar: (req, res) => {
    basic.insertRespond(req, res, 'pipeline_variables')
  },

  updateVar: (req, res) => {
    basic.patchRespond(req, res, 'pipeline_variables')
  },

  deleteVar: (req, res) => {
    basic.deleteRespond(req, res, 'pipeline_variables')
  }

}
