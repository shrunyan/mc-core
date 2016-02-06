'use strict'

let logger = require('tracer').colorConsole()
let connection = require('../../db/connection')
let validateAndDecodeJwt = require('../../security/validate-and-decode-jwt')

let respondUnauthorized = (res) => {
  res.status(401).send({message: 'Unauthorized'})
}

module.exports = function authMiddleware(req, res, next) {

  // check for JWT token, if none, respond that the user is unauthorized
  if (!req.cookies.mc_jwt) {
    respondUnauthorized(res)
    return
  }

  validateAndDecodeJwt(req.cookies.mc_jwt).then((decoded) => {

    logger.debug('validateAndDecodeJwt:then()')

    // If user_id was not provided in the JWT, they aren't authorized
    if (!decoded.user_id) {
      respondUnauthorized(res)
      return
    }

    connection.first().where('id', decoded.user_id).from('users').then((user) => {

      // Hide the user password hash
      delete user.password

      // Append the user data to the request object for easy access later
      req.user = user

      // Continue onto the next middleware or routing piece
      next()

    }).catch(err => {
      logger.error(err)
      respondUnauthorized(res)
    })

  }).catch(() => {
    logger.log('JWT provided but could not be verified')
    respondUnauthorized(res)
  })

}
