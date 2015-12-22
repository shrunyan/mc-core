export default ['$q', '$scope', '$http', '$stateParams', '$state', function($q, $scope, $http, $stateParams, $state) {

  $http.get('/api/pipelines/' + $stateParams.id).then(response => {
    $scope.pipeline = response.data.data

    $http.get('/api/projects/' + response.data.data.project_id).then(response => {
      $scope.project = response.data.data
    })

  })

  // Get Stage Data
  let stageTypes = $http.get('/api/stage-types')
  let stageConfigs = $http.get('/api/pipelines/' + $stateParams.id + '/stages')
  $q.all([stageTypes, stageConfigs])
    .then(args => {
      let types = args[0].data.data
      let stages = args[1].data.data

      $scope.stages = stages.map(stage => {
        let type = types.find(type => type.fqid === stage.type)
        if (type) {
          stage.schema = type
        }
        return stage
      })

      setTimeout(function() {
        $(function() {
          $('.pipeline-stage a.configure').on('click', function() {
            $(this).parent().parent().find('.panel-body').slideToggle(200)
          })
        })

      }, 1)

    })

  // Delete Stage
  $scope.remove = (id) => {
    $http.delete('/api/stage/' + id)
    $state.go($state.$current, null, { reload: true })
  }

}]
