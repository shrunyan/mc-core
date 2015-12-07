'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let basic = require('./basic-response-helper')

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
   * Gets a single execution with its key details
   *
   * @param req
   * @param res
   */
  getOneWithDetails: (req, res) => {

    let p1 = connection.first().where('id', req.params.id).from('pipeline_executions')
    //let p2 = connection.select().orderBy('name', 'ASC').from('pipeline_stage_executions')
    //let p3 = connection.select().orderBy('name', 'ASC').from('pipeline_execution_logs')

    Promise.all([p1]).then((values) => {
      let execution = values[0]

      // Append owner
      execution.owner = {
        id: 1,
        first_name: 'Andy',
        last_name: 'Fleming'
      }

      // Append stage executions
      execution.stageExecutions = []

      // Append logs
      execution.logs = []

      res.send({data:execution})

    }).catch(err => {
      logger.error(err)
      res.status(500).send({message: 'An error occurred.'})
    })
  }

}