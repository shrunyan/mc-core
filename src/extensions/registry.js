'use strict'

let fs = require('fs')
let logger = require('tracer').colorConsole()
let validator = require('mc-extension-validator')

let registry = {

  _registeredExtensions: {},

  loadFrom: (dir) => {
    // Loop through extensions found in node_modules/ (anything starting with mc-ext-)
    fs.readdirSync(dir, (err, files) => {
      files.forEach((file) => {
        if (file.startsWith('mc-ext-')) {
          let extensionToRegister = require(file)
          this.register(extensionToRegister, file)
        }
      })
    })
  },

  validate: (ext) => {
    validator.validateIndex(ext, (errors, warnings) => {

    })
  },

  register: (ext, file) => {
    this.validate(ext, () => {
        this._registeredExtensions[ext.vendor][ext.name] = ext
    })
  },

  getType: (extensionItemPath) => {
    let parts = extensionItemPath.split('.')
    let path = {
      vendor: parts[0],
      name: parts[1],
      type: parts[2],
      typeName: parts[3]
    }

    return this._registeredExtensions[path.vendor][path.name][path.type][path.typeName]
  }

}

registry.loadFrom('node_modules')

//registry.getType('mc.core.stage.pause-for-x-seconds')

module.exports = registry



// Loop through node_modules directory
// Look for some sort of indicator that a node_module is a mission control extension
// - mc-extension.js
// - package.json have a custom value in a mission_control property
// - mc-extension.json (in addition to index.js)
// - package is named mc-ext-*



// If it is an mc extension, "load it"
//let ext = require('module')
//
//registerExtension(ext)



// During pipeline execution
//registry.get('mc.core.stage.pause')
//registry.getStageTypes()


// TODO: need to register extensions on startup
// TODO: routes for available stages
// TODO: routes to get stage instances for a pipeline



// OLD IDEAS:

// extension-registry

// Registering...
// Loop through ../../node_modules...
// Find any ones with mc-extension.js
// If so newExt = ../../node_modules/example/mc-extension
// registry[newExt.vendor][newExt.name] = newExt
