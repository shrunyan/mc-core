'use strict'

const PIPELINE_CONFIGS = 'pipeline_configs'

let execPipeline = require('../../core/pipelines/execute-pipeline-command')
let query = require('../../db/queries')
let success = require('../utils/responses/success')
let created = require('../utils/responses/created')
let error = require('../utils/responses/error')
let configurePipelineFromExisting = require('../../core/pipelines/configure-pipeline-from-existing')

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

    let pipelineConfigIdToCopyFrom = false

    // If there is a pipeline config id provided (to copy from, capture and separate it)
    if (typeof req.body.copy_pipeline_config_id !== 'undefined') {
      pipelineConfigIdToCopyFrom = req.body.copy_pipeline_config_id
      delete req.body.copy_pipeline_config_id
    }

    query.insert(req.body, PIPELINE_CONFIGS)
      .then(id => {
        query.first(id, PIPELINE_CONFIGS)
          .then(() => {
            if (pipelineConfigIdToCopyFrom) {
              configurePipelineFromExisting(id, pipelineConfigIdToCopyFrom).then(created.bind(res))
            } else {
              created.bind(res)()
            }
          })
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
