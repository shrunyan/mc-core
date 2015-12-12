'use strict'

// Loop through node_modules directory
// Look for some sort of indicator that a node_module is a mission control extension
// - mc-extension.js
// - package.json have a custom value in a mission_control property
// - mc-extension.json (in addition to index.js)
// - package is named mc-ext-*

// If it is an mc extension, "load it"
let ext = require('module')

registerExtension(ext)



module.exports = registry


// During pipeline execution
registry.get('mc.core.stage.pause')
registry.getStageTypes()


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

let registry = {

  registeredExtensions: {},

  register: (ext) => {
    this.registeredExtensions[ext.vendor][ext.name] = ext
  },

  getType: (extensionItemPath) => {
    let parts = extensionItemPath.split('.')
    let path = {
      vendor: parts[0],
      name: parts[1],
      type: parts[2],
      typeName: parts[3]
    }

    return this.registeredExtensions[path.vendor][path.name][path.type][path.typeName]
  }

}

registry.getType('mc.core.stage.pause-for-x-seconds')

module.exports = registry

