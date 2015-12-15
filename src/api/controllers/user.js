'use strict'

let logger = require('tracer').colorConsole()
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
let connection = require('../../db/connection')

module.exports = {

  getUser: function(req, res) {

    connection.table('users')
      .first()
      .where('id', req.user.id)
      .then(function(user) {

        delete user.password
        res.send({data: user})
      }).catch(function(err) {

        logger.error(err)

        // TODO: differentiate between a 404 and a 500
        res.status(500).send({
          message: 'User not found or another error occurred.'
        })

      })

  },

  login: function(req, res) {

    // must have a secret key set
    if (!process.env.SECRET_KEY) {
      logger.error('Missing SECRET_KEY from your env')
    }

    // validate request
    if (!req.body.email || !req.body.password) {

      res.status(400).send({
        message: 'Both "email" and "password" are required fields.'
      })
      return

    }

    // Look up user
    connection
      .table('users')
      .first('id', 'email', 'password')
      .where('email', req.body.email)
      .then(function(user) {

        // Test hash. If successful, respond with JWT
        bcrypt.compare(req.body.password, user.password, (err, hash) => {

          if (err) {
            logger.error(err)
            res.status(401).send({
              message: 'Incorrect email or password.'
            })
          }

          try {
            let token = jwt.sign({user_id: user.id}, process.env.SECRET_KEY)
            res.cookie('mc_jwt', token, {
              maxAge: 3 * 24 * 60 * 60 * 1000,
              httpOnly: true
            })

            res.send({
              message: 'Successfully logged in.'
            })
          } catch (err) {
            logger.error(err)
          }

        })

      }).catch(function(err) {

        logger.error(err)
        res.status(401).send({
          message: 'Incorrect email or password.'
        })

      })

  },

  logout: function(req, res) {

    res.clearCookie('mc_jwt').send({
      message: 'Successfully logged out.'
    })

  }

}
