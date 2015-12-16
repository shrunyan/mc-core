export default ['$scope', '$http', function($scope, $http) {

  $http
    .get('/api/checks')
    .then(res => {

      console.log('health checks', res.data.data)
      $scope.checks = res.data.data

    })

}]
