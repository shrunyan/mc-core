export default ['$scope', '$http', function ($scope, $http) {
  $http.get('/api/projects').then(function (response) {

    // TODO: Get response from api
    $scope.pipeline = {
      id: 1,
      name: 'Pipeline one',
      path: 'pipeline-one'
    }

  })
}]
