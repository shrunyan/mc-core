'use strict'

let express = require('express')
let middleware = {
  auth: require('./middleware/auth'),
  notFound: require('./middleware/not-found')
}
let controllers = {
  pipelines: require('./controllers/pipelines'),
  user: require('./controllers/user'),
}

module.exports = function (app) {

  // Authentication middleware
  app.use('/api/*', middleware.auth)

  // User
  app.get('/api/user', controllers.user.getUser)
  app.post('/login', controllers.user.login)
  app.all('/logout', controllers.user.logout)

  // Groups
  // TODO: GET /api/service-groups
  // TODO: POST /api/service-groups

  // Pipelines
  app.get('/api/pipelines', controllers.pipelines.getList)
  // TODO: POST /api/pipelines

  // Pipeline Executions
  // TODO: GET /api/pipeline-executions
  // TODO: POST /api/pipeline-executions

  // Static files
  app.use(express.static('./ui-build/'))

  // 404
  app.use(middleware.notFound)

}
