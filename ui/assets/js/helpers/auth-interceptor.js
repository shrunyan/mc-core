export default ['$q', '$rootScope', function($q, $rootScope) {
  return {
    //'response': function(response) {
    //  if (response.status == 401) {
    //    console.log('found 401!');
    //  }
    //  return response;
    //}
    'responseError': function(response) {

      // If this is a login attempt, return the response for login controller to handle
      if (response.config.url == '/login') {
        return $q.reject(response)
      }

      // Otherwise, if this is a 401, prompt re-authentication
      if (response.status == 401) {

        return $rootScope.showLogin(response);

      }

      // If it is not a 401 and not a login attempt, just return the error for the controller to handle
      return response
    }
  };
}]