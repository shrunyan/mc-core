'use strict'

const jwt = require('jsonwebtoken')
const logger = require('tracer').colorConsole()

module.exports = function createJwt(userId) {
  try {
    return jwt.sign({user_id: userId}, process.env.SECRET_KEY, {algorithm: 'HS256'})

  } catch (err) {
    logger.error(err)
    return err
  }
}
