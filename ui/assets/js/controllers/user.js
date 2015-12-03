export default ['$rootScope', '$http', function ($rootScope, $http) {

  /**
   * Load the authenticated user's details. This is written as a root function to be called on a profile update, etc.
   */
  $rootScope.loadAuthenticatedUser = function loadAuthenticatedUser() {
    $http.get('/api/user').then(function (response) {
      $rootScope.user = response.data.data
    })
  }

  // Initially load the authenticated user's details
  $rootScope.loadAuthenticatedUser()

}]
