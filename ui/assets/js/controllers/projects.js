export default ['$scope', '$http', function ($scope, $http) {
  $http.get('/api/projects').then(function (response) {

    // TODO: Get response from api
    // TODO: Map data and derive url friendly paths from names
    $scope.projects = [{
      id: 1,
      name: 'Project one',
      path: 'project-one',
      pipelines: [{
        id: 1,
        name: 'Pipeline one',
        path: 'pipeline-one'
      }]
    }]

  })
}]
