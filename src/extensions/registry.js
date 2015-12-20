'use strict'

//let validator = require('mc-extension-validator')
let glob = require('glob')

const EXT_PATH = process.cwd() + '/node_modules/mc-ext-*'

let registry = {

  _extensions: {},

  load: function load() {
    this.resolve(EXT_PATH)
    return this._extensions
  },

  /**
   * [resolve all `mc-ext-*` modules]
   * @param  {string} dir [path mission control extensions]
   */
  resolve: function resolve(dir) {
    let modules = glob.sync(dir)
    modules.forEach(module => {
      this.register(require(module))
    })
  },

  /**
   * [register provided module]
   * @param  {[Object]} module [Module instance]
   */
  register: function register(module) {
    // TODO: validate stage types
    // TODO: validate log types
    if (!this._extensions[module.vendor]) {
      this._extensions[module.vendor] = {}
    }

    this._extensions[module.vendor][module.name] = {
      name: module.name,
      description: module.description,
      stages: module.stages,
      logs: module.logs
    }
  },

  /**
   * [validate a single module]
   * @param  {[Object]} ext [Object instance of loaded module]
   * @return {[Object]}     [Validated module]
   */
  validate: function validate(ext) {
    // TODO validate
    //validator.validateIndex(ext, (err) => {
    //  console.log('validated?', err)
    //})

    return ext
  },

  /**
   * [get any path depth from the extensions object]
   * @param  {[string]} name [dot syntax path]
   * @return {[object]}      [resolved extension path]
   */
  get: function get(name) {
    let paths = name.split('.')
    return paths.reduce((prev, path) => {
      switch(path) {
        case 'stages':
          return prev.stages
        case 'logs':
          return prev.logs
        default:
          return prev[path]
      }
    }, this._extensions)
  }

}

// Initially load extensions
registry.load()

module.exports = registry
