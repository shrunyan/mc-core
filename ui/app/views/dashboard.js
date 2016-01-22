export default ['$scope', '$http', 'socket', function($scope, $http, socket) {

  $http.get('/api/pipeline-executions/recent').then(response => {
    $scope.pipelineExecutions = response.data.data.slice(0, 5)
  })

}]
