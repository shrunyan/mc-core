export default ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

  $http.get('/api/pipeline-executions/' + $stateParams.id + '/with-details').then(function(response) {

    $scope.execution = response.data.data
    console.log(response.data.data)

    $http.get('/api/projects/' + response.data.data.config_snapshot.pipeline.project_id).then(response => {
      $scope.project = response.data.data
    })

  })

}]
