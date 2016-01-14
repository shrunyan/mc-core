'use strict'

//let validator = require('mc-extension-validator')
let glob = require('glob')
let webhookHelper = require('./webhook-helper')

const EXT_PATH = process.cwd() + '/node_modules/mc-ext-*'

let registry = {

  _extensions: {},
  _typesByFqids: {},
  _webhooks: [],

  /**
   * Resolve all `mc-ext-*` modules and register them
   *
   * @param  {string} dir Path mission control extensions
   */
  resolve: function resolve(dir) {
    let modules = glob.sync(dir)
    modules.forEach(module => {
      this.register(require(module))
    })
  },

  /**
   * Reload all extensions
   */
  reload: function reload() {

    // Reset all of our internal registry pieces
    this._extensions = {}
    this._typesByFqids = {}

    // Reload the modules
    this.resolve(EXT_PATH)
  },

  /**
   * [register provided module]
   * @param  {Object} module [Module instance]
   */
  register: function register(module) {

    if (typeof this._extensions[module.vendor] !== 'object') {
      this._extensions[module.vendor] = {}
    }

    // TODO: validate extension index

    this._extensions[module.vendor][module.id] = {
      vendor: module.vendor,
      id: module.id,
      name: module.name,
      description: module.description
    }

    this.registerStageTypes(module)
    this.registerLogTypes(module)
    this.registerWebhooks(module)
    //this.registerAccountsTypes(module)

  },

  registerStageTypes: function registerStageTypes(module) {

    if (Array.isArray(module.stages)) {

      module.stages.forEach(stage => {

        // TODO: validate stage type

        // Register the stage as vendor.extension_id.stages.example
        let fqid = module.vendor + '.' + module.id + '.stages.' + stage.id
        this._typesByFqids[fqid] = stage

      })
    }

  },

  registerLogTypes: function registerLogTypes(module) {

    if (Array.isArray(module.logs)) {

      module.logs.forEach(log => {

        // TODO: validate log type

        // Register the stage as vendor.extension_id.stages.example
        let fqid = module.vendor + '.' + module.id + '.logs.' + log.id
        this._typesByFqids[fqid] = log

      })
    }

  },

  registerWebhooks: function registerWebhooks(module) {

    console.log('running registry:registerWebhooks for ' + module.vendor + ' ' + module.name)

    if (Array.isArray(module.webhooks)) {

      module.webhooks.forEach(webhook => {

        console.log('found webhook')
        console.dir(webhook)

        let verb = (typeof webhook.method === 'string') ? webhook.method.toLowerCase() : 'all'
        let allowedVerbs = ['all', 'get', 'post', 'put', 'patch', 'delete']

        if (allowedVerbs.indexOf(verb) === -1) {
          console.log('invalid webhook route verb')
          return
        }

        this._webhooks.push({
          verb: verb,
          path: '/ext/' + module.vendor + '/' + module.id + '/webhooks/' + webhook.route,
          handler: (req, res) => { webhook.handler(req, res, webhookHelper) }
        })

      })

    }

  },

  registerWebhookRoutes: function registerWebhookRoutes(app) {

    console.log('registering webhook routes with express app')

    // Register the route with express
    this._webhooks.forEach(webhook => {
      console.log('Registering extension webhook')
      console.log(webhook.verb.toUpperCase() + ': ' + webhook.path)
      app[webhook.verb](webhook.path, webhook.handler)
    })

  },

  /**
   * Get an item/type from the extension via the FQID (full-qualified identifier)
   *
   * @param  {string} name [dot syntax path]
   * @return {object}      [resolved extension path]
   */
  get: function get(name) {
    if (typeof this._typesByFqids[name] !== 'undefined') {
      return this._typesByFqids[name]
    } else {
      throw new Error('Extension FQID "' + name + '" not found')
    }
  },

  /**
   * Get stage types
   *
   * @return {Array}
   */
  getStageTypes: function getStageTypes() {
    let stages = []

    for (let fqid in this._typesByFqids) {
      // Shallow clone so we don't mutate the stage object
      let stage = Object.assign({}, this._typesByFqids[fqid])
      stage.fqid = fqid
      stages.push(stage)
    }

    return stages
  }

}

// Initially load extensions
registry.resolve(EXT_PATH)

module.exports = registry
