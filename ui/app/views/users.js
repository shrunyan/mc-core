export default ['$scope', '$http', function($scope, $http) {

  $scope.example = 'Woot!'

  $http.get('/api/user').then(function(response) {

    console.log('got user response:')
    console.log(response)

  })

}]
