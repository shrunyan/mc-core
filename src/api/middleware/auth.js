'use strict'

let jwt = require('jsonwebtoken')

module.exports = function authMiddleware (req, res, next) {
  console.log('Auth Middleware: Start')

  // check for JWT token
  if (req.cookies.mc_jwt) {
    try {
      var decoded = jwt.verify(req.cookies.mc_jwt, process.env.SECRET_KEY)
      // TODO: look up user
      req.user = {
        id: 1,
        first_name: 'Andy',
        is_admin: 1
      }
      next()
      return
    } catch (err) {
      console.log('JWT not verified')
      console.log(err)
      // err
    }
  }

  console.log('Auth Middleware: Done')

  res.status(401).send({message: 'Unauthorized'})
}
