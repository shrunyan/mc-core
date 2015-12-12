export default ['$scope', '$http', function ($scope, $http) {

  $http
    .get('/api/checks')
    .then(res => {

      let checks = res.data.data

      console.log('health checks', checks)


      // $scope.projectHalves = [[], []]

      // // Split the projects into two arrays so we can output them in two columns elegantly
      // checks.forEach((project, index) => {
      //   $scope.projectHalves[(index % 2 === 0) ? 0 : 1].push(project)
      // })

    })

}]
