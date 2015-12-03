'use strict'

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
        .take(10)
    })
  }

}