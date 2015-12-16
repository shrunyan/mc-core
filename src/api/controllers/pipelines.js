'use strict'

let basic = require('./basic-response-helper')
let executePipelineCommand = require('../../core/pipelines/execute-pipeline-command')

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
      executePipelineCommand(req.params.id, req.body, req.user.id, (id) => {

        res.status(200).send({
          data: {
            pipeline_execution_id: id
          }
        })

      })

    } catch (err) {
      res.status(500).send()
    }
  }

}
