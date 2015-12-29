import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import 'angular-moment'
import 'angular-socket-io'
import routerAdder from './helpers/add-route'
import authInterceptor from './helpers/auth-interceptor'
import controllers from './controllers'

const app = angular.module('mission-control', [
  'ui.router',
  'ui.bootstrap',
  'angularMoment',
  'btford.socket-io'
])
const addRoute = routerAdder(app)

// Configure router with default route
app.config(['$urlRouterProvider', ($urlRouterProvider) => {

  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise('/dashboard')

}])

// Configure default $http request options and catch 401s with interceptor
app.config(['$httpProvider', ($httpProvider) => {

  // Automatically send credentials (cookies)
  $httpProvider.defaults.withCredentials = true
  // Register $http middleware/"interceptor" for re-authenticating
  $httpProvider.interceptors.push(authInterceptor)

}])

// Configure socket-io
app.factory('socket', ['socketFactory', function(socketFactory) {
  return socketFactory({
    ioSocket: io.connect() // using this syntax here in case we need to set options for socket.io later
  })
}])

// Provide filter for using "unsafe" html
app.filter('unsafe', ['$sce', function($sce) {
  return function(input) { return $sce.trustAsHtml(input) }
}])

// Provide quick way to check key length for an object
app.filter('keysLength', function() {
  return function(input) { return Object.keys(input).length }
})

app.run(controllers.socketManager)
app.run(controllers.user)
app.run(controllers.login)
app.run(controllers.modals)
app.run(controllers.helpers)

// Routes
addRoute('dashboard', '/dashboard', 'dashboard.html', controllers.dashboard)

addRoute('projects', '/projects', 'projects.html', controllers.projects)
// addRoute('project', '/project/:project', '/project/project.html', controllers.project)

addRoute('pipelines', '/pipelines', 'pipelines.html', controllers.pipelines)
addRoute('pipeline-execution-details', '/pipelines/executions/{id}', 'pipeline-execution-details.html', controllers.pipelineExecutionDetails)
addRoute('pipeline', '/pipelines/{id}', 'pipeline.html', controllers.pipeline)
addRoute('configure-pipeline', '/pipelines/{id}/configure', 'configure-pipeline.html', controllers.configurePipeline)

addRoute('health', '/health', 'health.html', controllers.health)

addRoute('applications', '/resources/applications', '/resources/applications.html', controllers.applications)
addRoute('application-builds', '/resources/application-builds', '/resources/application-builds.html', controllers.applicationBuilds)
addRoute('servers', '/resources/servers', '/resources/servers.html', controllers.servers)
addRoute('files', '/resources/files', '/resources/files.html', controllers.files)
addRoute('credentials', '/resources/credentials', '/resources/credentials.html', controllers.credentials)
addRoute('github-repositories', '/resources/github-repositories', '/resources/github-repositories.html', controllers.githubRepositories)

addRoute('configuration', '/settings/general/configuration', '/settings/general/configuration.html', controllers.configuration)
addRoute('users', '/settings/general/users', '/settings/general/users.html', controllers.users)

addRoute('slack', '/settings/notifications/slack', '/settings/notifications/slack.html', controllers.slack)
addRoute('email', '/settings/notifications/email', '/settings/notifications/email.html', controllers.email)
