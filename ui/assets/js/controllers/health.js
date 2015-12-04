export default ['$scope', '$http', function ($scope, $http) {

  $http.get('/api/projects').then(function(response) {
    let projects = response.data.data

    $scope.projectHalves = [[], []]

    // Split the projects into two arrays so we can output them in two columns elegantly
    projects.forEach((project, index) => {
      $scope.projectHalves[(index % 2 === 0) ? 0 : 1].push(project)
    })

  })

}]
