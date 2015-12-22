export default ['$q', '$scope', '$http', '$stateParams', function($q, $scope, $http, $stateParams) {

  $http.get('/api/pipelines/' + $stateParams.id).then(response => {
    $scope.pipeline = response.data.data

    $http.get('/api/projects/' + response.data.data.project_id).then(response => {
      $scope.project = response.data.data
    })

  })

  let stageTypes = $http.get('/api/stage-types')
  let stageConfigs = $http.get('api/pipelines/' + $stateParams.id + '/stages')

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
            console.log('clicked')
            $(this).parent().parent().find('.panel-body').slideToggle(200)
          })
        })

      }, 1)

    })

}]
