export default ['$scope', '$http', '$uibModalInstance', function($scope, $http, $uibModalInstance) {

  $scope.ok = () => {
    $http
      .post('/api/pipelines', {
        project_id: $scope.$parent.$id,
        name: $scope.name
      })
      .then(res => {
        $uibModalInstance.close(res.data.data)
      })
  }

  $scope.cancel = () => $uibModalInstance.dismiss('cancel')

}]
