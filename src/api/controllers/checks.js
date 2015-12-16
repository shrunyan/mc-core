'use strict'

let basic = require('./basic-response-helper')

module.exports = {
  create: (req, res) => basic.insertRespond(req, res, 'health_checks'),
  getAll: (req, res) => basic.getList(req, res, 'health_checks'),
  getCheck: (req, res) => {},
  getByProject: (req, res) => {}
}
