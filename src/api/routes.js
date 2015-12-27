'use strict'

let express = require('express')
let middleware = {
  auth: require('./middleware/auth'),
  notFound: require('./middleware/not-found')
}
let controllers = {
  pipelines: require('./controllers/pipelines'),
  pipelineExecutions: require('./controllers/pipeline-executions'),
  pipelineVariables: require('./controllers/pipeline-variables'),
  projects: require('./controllers/projects'),
  user: require('./controllers/user'),
  checks: require('./controllers/checks'),
  stages: require('./controllers/stages')
}

module.exports = function(app) {

  // Authentication Verification middleware
  app.use('/api/*', middleware.auth)

  // Authentication
  app.post('/login', controllers.user.login)
  app.all('/logout', controllers.user.logout)

  // User
  app.get('/api/user', controllers.user.getUser)

  // Projects
  app.get('/api/projects', controllers.projects.getProjects)
  app.post('/api/projects', controllers.projects.createProject)
  app.get('/api/projects/with-pipelines', controllers.projects.getProjectsWithPipelines)
  app.get('/api/projects/:id', controllers.projects.getProject)

  // Pipelines
  app.get('/api/pipelines', controllers.pipelines.getList)
  app.post('/api/pipelines', controllers.pipelines.createPipeline)
  app.get('/api/pipelines/:id', controllers.pipelines.getPipeline)
  app.get('/api/pipelines/:id/executions', controllers.pipelineExecutions.getListForPipeline)
  app.post('/api/pipelines/:id/execute', controllers.pipelines.executePipeline)

  // Pipeline Variables
  app.get('/api/pipelines/:pipeline_id/variables', controllers.pipelineVariables.getListForPipeline)
  app.post('/api/pipelines/:pipeline_id/variables', controllers.pipelineVariables.createVar)
  app.patch('/api/pipelines/:pipeline_id/variables/:id', controllers.pipelineVariables.updateVar)
  app.delete('/api/pipelines/:pipeline_id/variables/:id', controllers.pipelineVariables.deleteVar)

  // Pipeline Stages
  app.get('/api/pipelines/:id/stages', controllers.stages.getListForPipeline)
  app.get('/api/stage-types', controllers.stages.getAvailableTypes)

  app.post('/api/stage/config', controllers.stages.setStageConfig)
  app.patch('/api/stage/:id', controllers.stages.updateStageConfig)
  app.delete('/api/stage/:id', controllers.stages.deleteStageConfig)

  // Pipeline Executions
  // TODO: GET /api/pipeline-executions
  app.get('/api/pipeline-executions/recent', controllers.pipelineExecutions.getRecent)
  app.get('/api/pipeline-executions/:id/with-details', controllers.pipelineExecutions.getOneWithDetails)
  // TODO: POST /api/pipeline-executions

  // Pipeline Stage Executions

  // Pipeline Execution Logs

  // Health Checks
  app.get('/api/checks', controllers.checks.getAll)
  app.post('/api/check', controllers.checks.create)

  // Static files
  app.use(express.static('./node_modules/mc-core/ui-build/'))

  // 404
  app.use(middleware.notFound)

}
