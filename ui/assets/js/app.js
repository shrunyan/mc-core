import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import routerAdder from './helpers/add-route.js'
import dashboardController from './view-controllers/dashboard-controller.js'

var app = angular.module('mission-control', [
  'ui.router',
  'ui.bootstrap'
])

// For any unmatched url, redirect to /dashboard
app.config(['$urlRouterProvider', function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard')
}])

var addRoute = routerAdder(app)

addRoute('dashboard', '/dashboard', 'dashboard.html', dashboardController)
