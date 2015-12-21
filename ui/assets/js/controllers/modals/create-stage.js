export default ['$scope', '$http', '$uibModalInstance', function($scope, $http, $uibModalInstance) {

  $http
    .get('/api/stage-types')
    .then(res => $scope.stages = res.data.data)

  $scope.ok = () => {
    // submit stage config
    // $uibModalInstance.close()
  }

  $scope.cancel = () => {
    $uibModalInstance.dismiss('cancel')
  }

}]
