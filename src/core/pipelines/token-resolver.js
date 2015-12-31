'use strict'

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

  /**
   * Process tokens in a string
   *
   * @param {string} stringWithTokens
   */
  process(stringWithTokens) {

    let searchPattern = /{\[[\s\t]*?mc\.([a-z0-9_\(\)\.]*)[\s\t]*?\]}/g

    return stringWithTokens.replace(searchPattern, (wholeMatch, rightSideVariable, offset, originalString) => {

      if ('timestamp()' === rightSideVariable) {
        return Math.floor(Date.now() / 1000)


      } else if (rightSideVariable.substr(0,4) === 'var.') {
        // if the token is something like mc.var.example
        if (typeof this._userVariables[rightSideVariable] === 'string') {
          return rightSideVariable
        } else {
          logger.error('User variable not found: "' + rightSideVariable + '"')
          return '1'
        }


      } else {
        if (typeof this._baseData[rightSideVariable] === 'string') {
          return rightSideVariable
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

    for (let key in object) {
      object[key] = this.process(object[key])
    }

  }

}