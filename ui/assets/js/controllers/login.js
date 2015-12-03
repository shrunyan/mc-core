export default ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

  $rootScope.showLoginError = false
  $rootScope.loginForm = {
    email: '',
    password: ''
  }

  $rootScope.showLogin = function showLogin (originalResponse) {

    jQuery('#login').fadeIn()

    let deferred = $q.defer()
    $rootScope.originalResponse = originalResponse
    $rootScope.promise = deferred

    return deferred.promise

  }

  $rootScope.attemptLogin = function attemptLogin () {

    $http.post('/login', $rootScope.loginForm).then((response) => {

      // If there was a request in progress, re-run it
      if ($rootScope.originalResponse) {
        $rootScope.promise.resolve($http($rootScope.originalResponse.config))
      }

      // Hide login form
      jQuery('#login').hide()

      // Reset login errors
      $rootScope.showLoginError = false

      // Load/reload user details
      $rootScope.loadAuthenticatedUser()

      // Reset the form
      $rootScope.loginForm = {
        email: '',
        password: ''
      }

    }, () => {

      $rootScope.showLoginError = true

    })

  }

  $rootScope.logout = function logout () {
    $http.post('/logout').then(() => {
      $rootScope.showLogin()
    })
  }

}]
