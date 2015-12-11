'use strict'

let logger = require('tracer').colorConsole()
let basic = require('./basic-response-helper')

module.exports = {

  create: (req, res) => basic.insertRespond(req, res, 'health_checks'),

  getAll: (req, res) => {},

  getCheck: (req, res) => {},

  getByProject: (req, res) => {}

}
