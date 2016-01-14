'use strict'

const PIPELINE_CONFIGS = 'pipeline_configs'

let execPipeline = require('../../core/pipelines/execute-pipeline-command')
let query = require('../../db/queries')
let success = require('../utils/responses/success')
let created = require('../utils/responses/created')
let error = require('../utils/responses/error')

module.exports = {

  /**
   * Sends a list of pipelines
   *
   * @param req
   * @param res
   */
  getList: (req, res) => {
    query.all(PIPELINE_CONFIGS)
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  /**
   * Get a single pipeline config
   *
   * @param req
   * @param res
   */
  getPipeline: (req, res) => {
    query.first(req.params.id, PIPELINE_CONFIGS)
      .then(success.bind(res))
      .catch(error.bind(res))
  },

  /**
   * Create a pipeline
   *
   * @param req
   * @param res
   */
  createPipeline: (req, res) => {
    query.insert(req.body, PIPELINE_CONFIGS)
      .then(id => {
        query.first(id, PIPELINE_CONFIGS)
          .then(created.bind(res))
          .catch(error.bind(res))
      })
      .catch(error.bind(res))
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

        success.call(res, {
          data: {
            pipeline_execution_id: id
          }
        })

      }

      let options = {
        input: PARAMS,
        userId: USER_ID
      }

      execPipeline(PIPELINE_ID, options, CALLBACK)

    } catch (err) {
      error.call(res, err)
    }
  }

}
