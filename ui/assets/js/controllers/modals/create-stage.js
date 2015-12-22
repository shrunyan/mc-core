export default ['$scope', '$http', '$uibModalInstance', function($scope, $http, $uibModalInstance) {

  // get stages in parent controller
  console.log('create-stage scope', $scope.$parent.$stages)

  $http
    .get('/api/stage-types')
    .then(res => $scope.stages = res.data.data)

  $scope.ok = () => {

    let sort = $scope.$parent.$stages
      ? $scope.$parent.$stages.length + 1
      : 0

    $http
      .post('/api/stage/config', {
        pipeline_config_id: $scope.$parent.$id,
        type: $scope.stage_id,
        sort: sort
        // options: {}
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })

    $uibModalInstance.close()
  }

  $scope.cancel = () => {
    $uibModalInstance.dismiss('cancel')
  }

}]
