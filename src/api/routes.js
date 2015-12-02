'use strict'

let express = require('express')
let authMiddleware = require('./middleware/auth')
let pipelinesController = require('./controllers/pipelines')
let userController = require('./controllers/user')
let notFoundController = require('./controllers/not-found')

module.exports = function (app) {

  // Authentication middleware
  app.use('/api/*', authMiddleware)

  // User
  app.get('/api/user', userController.getUser)
  app.post('/login', userController.login)
  app.all('/logout', userController.logout)

  // Groups
  // TODO: GET /api/groups
  // TODO: POST / api/groups

  // Pipelines
  app.get('/api/pipelines', pipelinesController.getList)
  // TODO: POST /api/pipelines

  // Pipeline Executions
  // TODO: GET /api/pipeline-executions
  // TODO: POST /api/pipeline-executions

  // Static files
  app.use(express.static('./ui-build/'))

  // 404
  app.use(notFoundController.notFound)

}
