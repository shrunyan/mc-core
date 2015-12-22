export default ['$scope', '$http', function($scope, $http) {

  $http.get('/api/pipeline-executions/recent').then(response => {
    $scope.pipelineExecutions = response.data.data
  })

  $http.get('/api/projects/with-pipelines').then(response => {
    $scope.projects = response.data.data

    $scope.projects.forEach(proj => {
      proj.pipelines.forEach(p => {
        $http.get('/api/pipelines/' + p.id + '/executions?limit=8').then(response => {
          p.executions = response.data.data
        })
      })
    })

  })

  $scope.execute = function execute(pipelineConfigId) {
    $http.post('/api/pipelines/' + pipelineConfigId + '/execute', {})
  }

}]
