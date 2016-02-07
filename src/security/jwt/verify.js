'use strict'

const jwt = require('jsonwebtoken')
const logger = require('tracer').colorConsole()

/**
 * verify Wraps the `jwt` modules `verify` func
 * in a promise.
 * @param  {String} providedJwt signed jwt
 * @return {Object}             decoded jwt
 */
module.exports = function verifyJwt(providedJwt) {
  return new Promise((resolve, reject) => {
    try {
      // Attempt to decode the jwt
      const decoded = jwt.verify(providedJwt, process.env.SECRET_KEY, {algorithms: ['HS256']})
      resolve(decoded)

    } catch (err) {
      logger.error(err)
      reject(err)

    }
  })
}
