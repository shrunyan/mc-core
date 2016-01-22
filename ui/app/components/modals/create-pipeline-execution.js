export default ['$scope', '$http', '$uibModalInstance', 'data', function($scope, $http, $uibModalInstance, data) {

  let pipelineConfigId = data.id
  let input = {}
  $scope.overridesPanelShowing = false

  $scope.toggleOverridesPanel = function toggleOverridesPanel() {
    $scope.overridesPanelShowing = !$scope.overridesPanelShowing
  }

  $scope.loadPipelineAndProject = function loadPipelineAndProject() {
    $http.get('/api/pipelines/' + pipelineConfigId).then(response => {
      $scope.pipeline = response.data.data

      $http.get('/api/projects/' + response.data.data.project_id).then(response => {
        $scope.project = response.data.data
      })

    })
  }

  /**
   * Loads the pipeline variables
   */
  $scope.loadVariables = function loadVariables() {
    $http.get('/api/pipelines/' + pipelineConfigId + '/variables').then(response => {

      // Set up the value key for each variable
      for (let key in response.data.data) {
        if (!response.data.data[key].required) {
          response.data.data[key].value = response.data.data[key].default_value
        } else {
          response.data.data[key].value = null
        }
      }

      $scope.variables = response.data.data
    })
  }

  $scope.ok = () => {

    for (let key in $scope.variables) {
      input[$scope.variables[key].name] = $scope.variables[key].value
    }

    console.log('starting pipeline execution for config #' + pipelineConfigId + ' with input:')
    console.log(input)

    $http.post('/api/pipelines/' + pipelineConfigId + '/execute', input).then((res) => {
      $uibModalInstance.close(res.data.data)
    })
  }

  $scope.cancel = () => $uibModalInstance.dismiss('cancel')

  $scope.loadPipelineAndProject()
  $scope.loadVariables()

}]
