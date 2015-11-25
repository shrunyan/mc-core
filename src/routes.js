import auth from './middleware/auth'
import pipelines from './controllers/pipelines'

import passport from 'passport'
import {Strategy} from 'passport-local'

passport.use(new Strategy(function (username, pasword, done) {
  // console.log('HERE')
  return done(null, false)
}))

export default function (app) {
  app.use('/api/*', auth)

  app.get('/', (req, res) => {
    res.send({message: 'Welcome to the API!'})
  })

  app.get('/api/pipelines', pipelines.getList)
}
