import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import 'angular-moment'
import 'angular-socket-io'
import routerAdder from './helpers/add-route'
import authInterceptor from './helpers/auth-interceptor'
import components from './components'
import views from './views'

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
addRoute('dashboard', '/dashboard', 'dashboard.html', views.dashboard)

addRoute('projects', '/projects', 'projects.html', views.projects)
// addRoute('project', '/project/:project', '/project/project.html', components.project)

addRoute('pipelines', '/pipelines', 'pipelines.html', views.pipelines)
addRoute('pipeline-execution-details', '/pipelines/executions/{id}', 'pipeline-execution-details.html', views.pipelineExecutionDetails)
addRoute('pipeline', '/pipelines/{id}', 'pipeline.html', views.pipeline)
addRoute('configure-pipeline', '/pipelines/{id}/configure', 'configure-pipeline.html', views.configurePipeline)

addRoute('health', '/health', 'health.html', views.health)

addRoute('applications', '/resources/applications', 'applications.html', views.applications)
addRoute('application-builds', '/resources/application-builds', 'application-builds.html', views.applicationBuilds)
addRoute('servers', '/resources/servers', 'servers.html', views.servers)
addRoute('files', '/resources/files', 'files.html', views.files)
addRoute('credentials', '/resources/credentials', 'credentials.html', views.credentials)
addRoute('github-repositories', '/resources/github-repositories', 'github-repositories.html', views.githubRepositories)

addRoute('configuration', '/settings/general/configuration', 'configuration.html', views.configuration)
addRoute('users', '/settings/general/users', 'users.html', views.users)

addRoute('slack', '/settings/notifications/slack', 'slack.html', views.slack)
addRoute('email', '/settings/notifications/email', 'email.html', views.email)

