export default ['$scope', '$http', function($scope, $http) {

  $http.get('/api/pipeline-executions/recent').then(response => {
    $scope.pipelineExecutions = response.data.data
  })

  $http.get('/api/projects/with-pipelines').then(response => {
    $scope.projects = response.data.data
  })

  $scope.execute = function execute(pipelineConfigId) {
    $http.post('/api/pipelines/'+ pipelineConfigId + '/execute', {})
  }

}]
