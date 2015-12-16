export default ['$scope', '$http', '$uibModalInstance', 'prefillData', function($scope, $http, $uibModalInstance, prefillData) {

  $scope.form = {
    name: ''
  }

  $http.get('/api/projects').then(response => {
    $scope.projects = response.data.data

    // If there was pre-filled data provided, use the project_id
    if (typeof prefillData !== 'undefined' && typeof prefillData.project_id !== 'undefined') {
      $scope.form.project_id = prefillData.project_id.toString()

    } /*else {

      // Otherwise, use the first project as the selected one
      $scope.form.project_id = $scope.projects[0].id.toString()
    }*/

  })

  $scope.ok = () => {
    $http
      .post('/api/pipelines', {
        project_id: $scope.form.project_id,
        name: $scope.form.name
      })
      .then(res => {
        $uibModalInstance.close(res.data.data)
      })
  }

  $scope.cancel = () => $uibModalInstance.dismiss('cancel')

}]
