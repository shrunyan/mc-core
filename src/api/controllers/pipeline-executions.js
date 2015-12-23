'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let basic = require('./basic-response-helper')
let renderDetails = require('../../extensions/render-log-details')

module.exports = {

  /**
   * Sends recently finished executions
   *
   * @param req
   * @param res
   */
  getRecent: (req, res) => {
    basic.getListCustom(req, res, 'pipeline_executions', function(query) {
      return query
        .orderBy('finished_at', 'desc')
        .whereNotNull('finished_at')
        .limit(10)
    })
  },

  /**
   *
   * @param req
   * @param res
   */
  getListForPipeline: (req, res) => {
    basic.getListCustom(req, res, 'pipeline_executions', (query) => {

      query
        .where('pipeline_config_id', req.params.id)
        .whereNotNull('finished_at')
        .orderBy('created_at', 'desc')

      if (req.query.limit) {
        query.limit(req.query.limit)
      }

      return query
    })
  },

  /**
   * Gets a single execution with its key details
   *
   * @param req
   * @param res
   */
  getOneWithDetails: (req, res) => {

    let pipelineExecution = connection.first().where('id', req.params.id).from('pipeline_executions')

    pipelineExecution.then((execution) => {

      execution.config_snapshot = JSON.parse(execution.config_snapshot)
      execution.stageConfigs = execution.config_snapshot.stageConfigs

      let p1 = connection.first().where('id', execution.owner_id).from('users')
      let p2 = connection.select().where('pipeline_execution_id', req.params.id).from('pipeline_stage_executions')
      let p3 = connection.select().where('pipeline_execution_id', req.params.id).from('pipeline_execution_logs')

      Promise.all([p1, p2, p3]).then((values) => {
        let owner = values[0]
        let stageExecutions = values[1]
        let logs = values[2]

        // Append a copy of the stageConfigs arranged by ID
        execution.stageConfigsById = {}
        execution.stageConfigs.forEach(config => {
          execution.stageConfigsById[config.id] = config
        })

        // Append owner
        execution.owner = owner

        // Append stage executions
        execution.stageExecutions = stageExecutions

        // Get details html for each log
        logs = renderDetails(logs)

        // Append logs
        execution.logs = logs

        res.send({data: execution})

      }).catch(err => {
        logger.error(err)
        res.status(500).send({message: 'An error occurred.'})
      })

    })

  }

}
