export default ['$scope', '$http', '$uibModalInstance', 'data', function($scope, $http, $uibModalInstance, data) {

  $http
    .get('/api/stage-types')
    .then(res => $scope.stages = res.data.data)

  $scope.ok = () => {
    let stage = $scope.stages.find(stage => {
      // $scope.stage_id is the user selected stage
      if (stage.id === $scope.stage_id) {
        return stage
      }
    })
    let sort = $scope.$parent.$stages
      ? $scope.$parent.$stages.length + 1
      : 0

    $http
      .post('/api/stage/config', {
        pipeline_config_id: data.pipelineId,
        type: stage.fqid,
        sort: sort,
        name: $scope.name || stage.name
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
