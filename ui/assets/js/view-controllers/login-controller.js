export default ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
  $rootScope.showLoginError = false

  $rootScope.showLogin = function showLogin (originalResponse) {
    jQuery('#login').fadeIn()

    let deferred = $q.defer()
    $rootScope.originalResponse = originalResponse
    $rootScope.promise = deferred

    return deferred.promise
  }

  $rootScope.attemptLogin = function attemptLogin () {
    let data = {
      email: $rootScope.loginFormEmail,
      password: $rootScope.loginFormPassword
    }

    $http.post('/login', data).then(function (response) {
      $rootScope.promise.resolve($http($rootScope.originalResponse.config))
      jQuery('#login').hide()
      $rootScope.showLoginError = false
    }, function () {
      $rootScope.showLoginError = true
    })
  }

  $rootScope.logout = function logout () {
    $http.post('/logout').then(function () {
      $rootScope.showLogin()
    })
  }
}]
