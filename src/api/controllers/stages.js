'use strict'

let pkgs = require('../../extensions/registry').load()

module.exports = {
  getAvailableTypes: function getAvailableTypes(req, res) {
    let stages = []

    for (let vendor in pkgs) {
      for (let ext in pkgs[vendor]) {
        for (let stage in pkgs[vendor][ext].stages) {
          stages.push({
            id: [vendor, ext, stage].join('.'),
            name: stage
          })
        }
      }
    }

    res.status(201).send({data: stages})
  }
}
