import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import 'angular-moment'
import 'angular-socket-io'
import routerAdder from './helpers/add-route'
import authInterceptor from './helpers/auth-interceptor'
import components from './components'

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

app.run(components.socketManager)
app.run(components.user)
app.run(components.login)
app.run(components.modals)
app.run(components.helpers)

// Routes
addRoute('dashboard', '/dashboard', 'dashboard.html', components.dashboard)

addRoute('projects', '/projects', 'projects.html', components.projects)
// addRoute('project', '/project/:project', '/project/project.html', components.project)

addRoute('pipelines', '/pipelines', 'pipelines.html', components.pipelines)
addRoute('pipeline-execution-details', '/pipelines/executions/{id}', 'pipeline-execution-details.html', components.pipelineExecutionDetails)
addRoute('pipeline', '/pipelines/{id}', 'pipeline.html', components.pipeline)
addRoute('configure-pipeline', '/pipelines/{id}/configure', 'configure-pipeline.html', components.configurePipeline)

addRoute('health', '/health', 'health.html', components.health)

addRoute('applications', '/resources/applications', 'applications.html', components.applications)
addRoute('application-builds', '/resources/application-builds', 'application-builds.html', components.applicationBuilds)
addRoute('servers', '/resources/servers', 'servers.html', components.servers)
addRoute('files', '/resources/files', 'files.html', components.files)
addRoute('credentials', '/resources/credentials', 'credentials.html', components.credentials)
addRoute('github-repositories', '/resources/github-repositories', 'github-repositories.html', components.githubRepositories)

addRoute('configuration', '/settings/general/configuration', 'configuration.html', components.configuration)
addRoute('users', '/settings/general/users', 'users.html', components.users)

addRoute('slack', '/settings/notifications/slack', 'slack.html', components.slack)
addRoute('email', '/settings/notifications/email', 'email.html', components.email)

