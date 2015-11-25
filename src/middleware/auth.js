import passport from 'passport'
import {Strategy} from 'passport-local'

passport.use(new Strategy(function (username, pasword, done) {
  // console.log('HERE')
  return done(null, false)
}))
// passport.serializeUser(serialize)
// passport.deserializeUser(deSerialize)

// function verify (username, pasword, done) {
//   // TODO: fetch user from database
//   console.log('HERE')
//   return done(null, false)
// }

export function serialize (user, cb) {
  cb(null, user.id)
}

export function deSerialize (id, cb) {
  // TODO: use ID to look in DB
  // and return user
}

export default function middleware (req, res, next) {
  console.log('Auth Middleware: Start')

  // Auth this biz
  passport.authenticate('local', {
    failureRedirect: '/fail'
  })

  console.log('Auth Middleware: Done')

  next()
}
