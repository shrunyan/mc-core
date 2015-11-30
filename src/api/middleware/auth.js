let jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  console.log('Auth Middleware: Start')

  // TODO: check for JWT token
  console.log(req.cookies);
  if (req.cookies.mc_jwt) {

    try {
      console.log('attempting to verify JWT')

      var decoded = jwt.verify(req.cookies.mc_jwt, process.env.SECRET_KEY)

      // TODO: look up user
      req.user = {
        id: 1,
        first_name: 'Andy'
      }
      next()


    } catch(err) {
      console.log('JWT not verified')
      console.log(err)
      // err
    }

  }

  console.log('Auth Middleware: Done')

  res.status(401).send({message: 'Unauthorized'})

}
