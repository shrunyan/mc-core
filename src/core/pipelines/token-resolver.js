'use strict'

let logger = require('tracer').colorConsole()
let objectGetByDotNotation = require('../../helpers/object-get-by-dot')

module.exports = class TokenResolver {

  /**
   *
   */
  constructor() {
    this._data = {
      var: {}
    }
  }

  /**
   *
   * @param {string} key
   * @param value
   */
  setKey(key, value) {
    this._data[key] = value
  }

  /**
   *
   * @param key
   * @param newValue
   */
  setUserVarValue(key, newValue) {
    this._data.var[key] = newValue
  }

  /**
   * Process tokens in a string
   *
   * @param {string} stringWithTokens
   */
  process(stringWithTokens) {

    let searchPattern = /{\[[\s\t]*?mc\.([a-z0-9_\(\)\.]*)[\s\t]*?\]}/g

    return stringWithTokens.replace(searchPattern, (wholeMatch, rightSideVariable, offset, originalString) => {

      // rightSideVariable will be something like example.whatever (derived from {[ mc.example.whatever ]})

      if (rightSideVariable === 'timestamp()') {
        return Math.floor(Date.now() / 1000)

      } else {
        return objectGetByDotNotation(this._data, rightSideVariable, '')
      }

    })
  }

  /**
   * Mutates the values in an object
   *
   * @param {object} object
   */
  processEach(object) {

    logger.debug('Searching for variables to replace in object:')
    logger.debug(object)

    for (let key in object) {
      object[key] = this.process(object[key])
    }

  }

}
