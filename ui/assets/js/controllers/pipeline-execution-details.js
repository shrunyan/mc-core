export default ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

  $http.get('/api/pipeline-executions/' + $stateParams.id + '/with-details').then(function (response) {

    $scope.execution = response.data.data

  })

}]
