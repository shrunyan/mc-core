'use strict'

let bcrypt = require('bcryptjs')
let logger = require('tracer').colorConsole()
let connection = require('../db/connection')

module.exports = function validateLogin(email, password) {

  logger.debug('inside validateLogin (return promise)')

  return new Promise((resolve, reject) => {

    logger.debug('inside validateLogin promise')

    connection
      .table('users')
      .first('id', 'email', 'password')
      .where('email', email)
      .then((user) => {

        if (!user) {
          reject()
          return
        }

        logger.debug('user')
        logger.debug(user)

        logger.debug('provided password')
        logger.debug(password)

        logger.debug('registered user password')
        logger.debug(user.password)

        // Test hash. If successful, respond with JWT
        bcrypt.compare(password, user.password, (err, result) => {

          logger.debug('in bcrypt compare')

          if (err) {
            logger.debug('invalid password for user')
            logger.error(err)
            reject()
            return
          }

          if (result === true) {
            logger.debug('password validated with bcrypt')
            resolve(user.id)

          } else {
            logger.debug('password invalid')
            reject()
          }

        })

      }).catch(function(err) {
        logger.debug('user not found')
        logger.error(err)
        reject()
      })

  })
}
