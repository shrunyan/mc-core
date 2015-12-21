export default ['$scope', '$http', '$uibModalInstance', function($scope, $http, $uibModalInstance) {

  console.log('scope', $scope)

  $http
    .get('/api/stage-types')
    .then(res => $scope.stages = res.data.data)

  $scope.ok = () => {
    $http
      .post('api/stages/', {
        stage_id: $scope.stage_id
      })
      .then(res => {
        console.log('res', res)
      })

    $uibModalInstance.close()
  }

  $scope.cancel = () => {
    $uibModalInstance.dismiss('cancel')
  }

}]
