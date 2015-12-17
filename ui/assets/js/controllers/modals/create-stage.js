export default ['$scope', '$http', '$uibModalInstance', function($scope, $http, $uibModalInstance) {

  console.log('Fetch stages')

  $http
    .get('/api/stages')
    .then(res => $scope.stages = res.data.data)

  $scope.ok = () => {
    // submit stage config
    // $uibModalInstance.close()
  }

  $scope.cancel = () => {
    $uibModalInstance.dismiss('cancel')
  }

}]
