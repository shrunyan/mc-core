'use strict'

let registry = require('../../extensions/registry')
let helper = require('./basic-response-helper')

const PKGS = registry.load()

module.exports = {
  create: function create(req, res) {
    const STAGE_ID = req.body.stage_id
    const STAGE = registry.get(STAGE_ID)

    console.log('create stage', STAGE)

    helper.insertRespond(req, res, 'pipeline_stage_configs')

  },
  getAll: function getAll(req, res) {
    let stages = []
    for (let vendor in PKGS) {
      for (let ext in PKGS[vendor]) {
        for (let stage in PKGS[vendor][ext].stages) {
          stages.push(PKGS[vendor][ext].stages[stage])
        }
      }
    }

    res.status(201).send({data: stages})
  },
  getExecutions: function getExecutions(req, res) {
    // body...
  },
  getAvailableTypes: function getAvailableTypes(req, res) {
    let PKGS = registry.load()
    let stages = []

    for (let vendor in PKGS) {
      for (let ext in PKGS[vendor]) {
        for (let stage in PKGS[vendor][ext].stages) {
          stages.push({
            id: [vendor, ext, 'stages', stage].join('.'),
            name: stage
          })
        }
      }
    }

    res.status(201).send({data: stages})
  }
}
