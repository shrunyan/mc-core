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
    jwt.verify(providedJwt, process.env.SECRET_KEY, {
      algorithms: ['HS256']
    }, (err, data) => {
      if (err) {
        logger.error(err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
