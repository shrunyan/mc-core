'use strict'

let registry = require('../../extensions/registry')

module.exports = {
  createStageConfig: function createStageConfig(req, res) {
    const STAGE_ID = req.body.stage_id
    const STAGE = registry.get(STAGE_ID)

    console.log('stage', STAGE)

  },
  getAvailableTypes: function getAvailableTypes(req, res) {
    let pkgs = registry.load()
    let stages = []

    for (let vendor in pkgs) {
      for (let ext in pkgs[vendor]) {
        for (let stage in pkgs[vendor][ext].stages) {
          let vendorName = pkgs[vendor][ext].vendor
          let extName = pkgs[vendor][ext].name
          let stageName = pkgs[vendor][ext].stages[stage].name

          stages.push({
            id: [vendorName, extName, stageName].join('.'),
            name: stage
          })
        }
      }
    }

    res.status(201).send({data: stages})
  }
}
