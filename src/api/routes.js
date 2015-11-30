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

  // app.get('/', (req, res) => {
  //  res.send({message: 'Welcome to the API!'})
  // })
  //
  // app.use('*', function(req, res) {
  //  res.sendFile('index.html');
  // })

  // Static files
  app.use(express.static('./build/ui/'))

  app.use(function (req, res, next) {
    res.status(404)

    // respond with html page
    if (req.accepts('html')) {
      res.send('<h1>404 Not found</h1>')
      return
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' })
      return
    }

    // default to plain-text. send()
    res.type('txt').send('Not found')
  })
}
