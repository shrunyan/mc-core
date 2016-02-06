export default ['$scope', '$http', '$uibModalInstance', 'data', function($scope, $http, $uibModalInstance, data) {

  $scope.form = {
    name: '',
    project_id: '',
    copy_pipeline_config_id: ''
  }

  $scope.copyConfigFromExisting = false

  $http.get('/api/projects').then(response => {
    $scope.projects = response.data.data

    // If there was pre-filled data provided, use the project_id
    if (typeof data !== 'undefined' && typeof data.project_id !== 'undefined') {
      $scope.form.project_id = data.project_id.toString()

    } /*else {

      // Otherwise, use the first project as the selected one
      $scope.form.project_id = $scope.projects[0].id.toString()
    }*/

  })

  $http.get('/api/pipelines').then(response => {
    $scope.pipelineConfigs = response.data.data
  })

  $scope.ok = () => {

    let data = {
      project_id: $scope.form.project_id,
      name: $scope.form.name
    }

    if ($scope.form.copy_pipeline_config_id !== '' && $scope.copyConfigFromExisting) {
      data['copy_pipeline_config_id'] = $scope.form.copy_pipeline_config_id
    }

    $http
      .post('/api/pipelines', data)
      .then(res => {
        $uibModalInstance.close(res.data.data)
      })
  }

  $scope.cancel = () => $uibModalInstance.dismiss('cancel')

}]
