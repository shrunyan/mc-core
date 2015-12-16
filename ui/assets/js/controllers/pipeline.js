export default ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

  $http.get('/api/pipelines/' + $stateParams.id).then(function(response) {
    $scope.pipeline = response.data.data
  })

}]
