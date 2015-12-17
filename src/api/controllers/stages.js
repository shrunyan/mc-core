'use strict'

let pkgs = require('../../extensions/registry').load()

module.exports = {
  getAvailableTypes: function getAvailableTypes(req, res) {
    let stages = []

    for (let pkg in pkgs) {
      for (let stage in pkgs[pkg]) {
        stages.push(stage)
      }
    }

    res.status(201).send({data: stages})
  }
}
