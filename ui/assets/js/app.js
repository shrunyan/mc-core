import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import routerAdder from './helpers/add-route.js'
import authInterceptor from './helpers/auth-interceptor.js'
import dashboardController from './view-controllers/dashboard-controller.js'
import loginController from './view-controllers/login-controller.js'

var app = angular.module('mission-control', [
  'ui.router',
  'ui.bootstrap'
])

// For any unmatched url, redirect to /dashboard
app.config(['$urlRouterProvider', function ($urlRouterProvider) {

  $urlRouterProvider.otherwise('/dashboard')

}])

// Configure $http
app.config(['$httpProvider', function ($httpProvider) {

  // Automatically send credentials (cookies)
  $httpProvider.defaults.withCredentials = true
  // Register $http middleware/"interceptor" for re-authenticating
  $httpProvider.interceptors.push(authInterceptor)

}])

app.run(loginController)

// Routes
var addRoute = routerAdder(app)

addRoute('dashboard', '/dashboard', 'dashboard.html', dashboardController)
