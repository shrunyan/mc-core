import auth from './middleware/auth'
import pipelines from './controllers/pipelines'
import express from 'express'

import passport from 'passport'
import {Strategy} from 'passport-local'

passport.use(new Strategy(function (username, pasword, done) {
  // console.log('HERE')
  return done(null, false)
}))

export default function (app, passport) {
  app.use('/api/*', auth)


  app.get('/api/pipelines', pipelines.getList)

  //app.get('/', (req, res) => {
  //  res.send({message: 'Welcome to the API!'})
  //})

  //app.use('*', function(req, res) {
  //  res.sendFile('index.html');
  //})

  // Static files
  app.use(express.static('./build'))

}
