'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

module.exports = {

  /**
   * Sends a list of pipelines
   *
   * @param req
   * @param res
   */
  getList: (req, res) => {
    connection.select().from('pipelines').then(function (pipelines) {
      res.send({data: pipelines})
    }).catch(err => {
      logger.error(err)
    })
  }

}
