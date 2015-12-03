'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

module.exports = {

  getList: (req, res) => {
    connection.select().from('pipelines').then(function (pipelines) {
      res.send({data: pipelines})
    }).catch(err => {
      logger.log(err)
    })
  }

}
