export default ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

  $http.get('/api/pipelines/' + $stateParams.id).then(response => {
    $scope.pipeline = response.data.data

    $http.get('/api/projects/' + response.data.data.project_id).then(response => {
      $scope.project = response.data.data
    })

  })

  $http.get('/api/pipelines/' + $stateParams.id + '/executions').then(response => {
    $scope.pipelineExecutions = response.data.data
  })

}]
