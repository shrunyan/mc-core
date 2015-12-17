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
    if (typeof this._extensions[module.vendor] !== 'object') {
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
    let obj = this._extensions
    let paths = name.split('.')

    paths.forEach(path => {
      if (!obj[path]) {
        let err = 'Undefined extensions path: ' + path
        throw err
      }
      obj = obj[path]
    })

    return obj
  }

}

// Initially load extensions
registry.load()

module.exports = registry
