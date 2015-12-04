export default ['$scope', '$http', '$uibModalInstance', function ($scope, $http, $uibModalInstance) {

  $scope.ok = function () {
    $http.post('/api/projects', {name: $scope.name}).then(response => {
      $uibModalInstance.close(response.data.data)
    })
  }

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel')
  }

}]
