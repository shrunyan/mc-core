'use strict'

let logger = require('tracer').colorConsole()

module.exports = class TokenResolver {

  /**
   *
   * @param baseData
   * @param userVariables
   */
  constructor(baseData, userVariables) {
    this._baseData = baseData
    this._userVariables = userVariables
  }

  setUserVarValue(key, newValue) {
    this._userVariables[key] = newValue
  }

  /**
   * Process tokens in a string
   *
   * @param {string} stringWithTokens
   */
  process(stringWithTokens) {

    let searchPattern = /{\[[\s\t]*?mc\.([a-z0-9_\(\)\.]*)[\s\t]*?\]}/g

    return stringWithTokens.replace(searchPattern, (wholeMatch, rightSideVariable, offset, originalString) => {

      if (rightSideVariable === 'timestamp()') {
        return Math.floor(Date.now() / 1000)

      } else if (rightSideVariable.substr(0, 4) === 'var.') {

        let userVarKey = rightSideVariable.substr(4)

        // if the token is something like mc.var.example
        if (typeof this._userVariables[userVarKey] === 'string') {
          return this._userVariables[userVarKey]
        } else {
          logger.error('User variable not found: "' + userVarKey + '"')
          return '1'
        }

      } else {
        if (typeof this._baseData[rightSideVariable] === 'string') {
          return this._baseData[rightSideVariable]
        } else {
          logger.error('Variable not found: "' + rightSideVariable + '"')
          return '1'
        }
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
