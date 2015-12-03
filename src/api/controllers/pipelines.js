'use strict'

let basic = require('./basic-response-helper')

module.exports = {

  /**
   * Sends a list of pipelines
   *
   * @param req
   * @param res
   */
  getList: (req, res) => {
    basic.getList(req, res, 'pipelines')
  },

  /**
   * Create a pipeline
   *
   * @param req
   * @param res
   */
  createPipeline: (req, res) => {
    basic.insertRespond(req, res, 'pipelines')
  }

}
