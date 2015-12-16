export default ['$scope', '$http', function($scope, $http) {

  $http.get('/api/pipeline-executions/recent').then(response => {
    $scope.pipelineExecutions = response.data.data.slice(0, 5)
  })

}]
