'use strict'

let jwt = require('jsonwebtoken')
let logger = require('tracer').colorConsole()

module.exports = function validateAndDecodeJwt(providedJwt) {

  return new Promise((resolve, reject) => {

    try {

      // Attempt to decode the jwt
      let decoded = jwt.verify(providedJwt, process.env.SECRET_KEY, {algorithms: ['HS256']})

      resolve(decoded)

    } catch (err) {
      logger.error(err)
      reject()

    }

  })

}
