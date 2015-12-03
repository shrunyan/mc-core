import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import routerAdder from './helpers/add-route'
import authInterceptor from './helpers/auth-interceptor'
import controllers from './controllers'

const app = angular.module('mission-control', [
  'ui.router',
  'ui.bootstrap'
])
const addRoute = routerAdder(app)

app.config(['$urlRouterProvider', ($urlRouterProvider) => {

  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise('/dashboard')

}])

app.config(['$httpProvider', ($httpProvider) => {

  // Automatically send credentials (cookies)
  $httpProvider.defaults.withCredentials = true
  // Register $http middleware/"interceptor" for re-authenticating
  $httpProvider.interceptors.push(authInterceptor)

}])

app.run(controllers.user)
app.run(controllers.login)

// Routes
addRoute('dashboard', '/dashboard', 'dashboard.html', controllers.dashboard)
addRoute('jobs', '/jobs', 'jobs.html', controllers.jobs)

addRoute('applications', '/resources/applications', 'applications.html', controllers.applications)
addRoute('application-builds', '/resources/application-builds', 'application-builds.html', controllers.applicationBuilds)
addRoute('servers', '/resources/servers', 'servers.html', controllers.servers)
addRoute('files', '/resources/files', 'files.html', controllers.files)
addRoute('credentials', '/resources/credentials', 'credentials.html', controllers.credentials)
addRoute('github-repositories', '/resources/github-repositories', 'github-repositories.html', controllers.githubRepositories)
addRoute('ami', '/resources/ami', 'ami.html', controllers.ami)
addRoute('elb', '/resources/elb', 'elb.html', controllers.elb)
addRoute('asg', '/resources/asg', 'asg.html', controllers.asg)
addRoute('ec2', '/resources/ec2', 'ec2.html', controllers.ec2)

addRoute('configuration', '/settings/general/configuration', 'configuration.html', controllers.configuration)
addRoute('users', '/settings/general/users', 'users.html', controllers.users)

addRoute('slack', '/settings/notifications/slack', 'slack.html', controllers.slack)
addRoute('email', '/settings/notifications/email', 'email.html', controllers.email)
