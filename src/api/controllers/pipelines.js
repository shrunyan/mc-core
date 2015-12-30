'use strict'

let basic = require('./basic-response-helper')
let execPipeline = require('../../core/pipelines/execute-pipeline-command')

module.exports = {

  /**
   * Sends a list of pipelines
   *
   * @param req
   * @param res
   */
  getList: (req, res) => {
    basic.getList(req, res, 'pipeline_configs')
  },

  /**
   * Get a single pipeline config
   *
   * @param req
   * @param res
   */
  getPipeline: (req, res) => {
    basic.getOne(req, res, 'pipeline_configs')
  },

  /**
   * Create a pipeline
   *
   * @param req
   * @param res
   */
  createPipeline: (req, res) => {
    basic.insertRespond(req, res, 'pipeline_configs')
  },

  /**
   * Start a new pipeline execution
   *
   * @param req
   * @param res
   */
  executePipeline: (req, res) => {
    try {
      const PIPELINE_ID = req.params.id
      const USER_ID = req.user.id
      const PARAMS = req.body
      const CALLBACK = (id) => {
        res.status(200).send({
          data: {
            pipeline_execution_id: id
          }
        })
      }

      execPipeline(PIPELINE_ID, PARAMS, USER_ID, CALLBACK)

    } catch (err) {
      res.status(500).send()
    }
  }

}
