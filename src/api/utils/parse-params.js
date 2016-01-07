'use strict'

/**
 * Stringify's all parameters that are objects
 * @param  {Object} params Request body
 * @return {Object}      Process request parameters
 */
module.exports = function parseParams(params) {
  for (let paramKey in params) {
    if (typeof params[paramKey] === 'object') {
      params[paramKey] = JSON.stringify(params[paramKey])
    }
  }
  return params
}
