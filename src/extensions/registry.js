'use strict'

// let logger = require('tracer').colorConsole()
let validator = require('mc-extension-validator')
let glob = require('glob')

const EXT_PATH = process.cwd() + '/node_modules/mc-ext-*'

let registry = {

  _extensions: {},

  load: function load () {
    this.resolve(EXT_PATH)
    //return this._extensions.map(this.validate)
  },

  /**
   * [resolve all `mc-ext-*` modules]
   * @param  {string} dir [path mission control extensions]
   */
  resolve: function resolve (dir) {
    let modules = glob.sync(dir)
    console.log('modules')
    console.log(modules)

    modules.forEach(module => {
      this.register(require(module))
    })
  },

  /**
   * [register provided module]
   * @param  {[Object]} module [Module instance]
   * @return {[type]}        [description]
   */
  register: function register (module) {

    if (typeof this._extensions[module.vendor] !== "object") {
      this._extensions[module.vendor] = {}
    }

    // TODO: validate stage types
    // TODO: validate log types

    this._extensions[module.vendor][module.name] = module
  },

  /**
   * [validate a single module]
   * @param  {[Object]} ext [Object instance of loaded module]
   * @return {[Object]}     [Validated module]
   */
  validate: function validate (ext) {

    // TODO validate
    //validator.validateIndex(ext, (err) => {
    //  console.log('validated?', err)
    //})

    return ext
  },

  get: function get (name) {
    return this._extensions.find(ext => ext.name === name)
  },

  getType: function getType (registeredName) {
    console.log('getType called for: ' + registeredName)
    let parts = registeredName.split('.')
    let path = {
      vendor: parts[0],
      name: parts[1],
      type: parts[2],
      typeName: parts[3]
    }

    // TODO: what is the intent of this function?
    return this._extensions[path.vendor][path.name][path.type][path.typeName]
  }

}

// Initially load extensions
registry.load()


module.exports = registry

// During pipeline execution
//registry.get('mc.core.stage.pause')
//registry.getStageTypes()


// TODO: need to register extensions on startup
// TODO: routes for available stages
// TODO: routes to get stage instances for a pipeline
