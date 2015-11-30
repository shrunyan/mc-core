modules.exports = function authMiddleware(req, res, next) {
  console.log('Auth Middleware: Start')

  // TODO: check for JWT token

  console.log('Auth Middleware: Done')

  next()
}
