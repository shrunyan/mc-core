import _ from 'lodash'

export default ['$q', '$scope', '$http', '$stateParams', '$state', function($q, $scope, $http, $stateParams, $state) {

  // This must be predefined for ng-model
  // values as objects
  $scope.stageOptions = {
    current: {},
    saved: {}
  }

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

      // Join the types with their stages
      $scope.stages = stages.map(stage => {
        let type = types.find(type => type.fqid === stage.type)
        if (type) {
          stage.schema = type
        }
        return stage
      })

      // Copy the options for stages to two maps
      stages.forEach(function(stage) {

        console.log(stage)

        // Set up holder objects
        // - one for the "last saved" value
        // - one for the current (bound) form value
        $scope.stageOptions.current[stage.id] = {}
        $scope.stageOptions.saved[stage.id] = {}

        // For each option that exits in the stage type...
        Object.keys(stage.schema.options).forEach((key) => {

          // If the user has specified value, use that
          // Otherwise, if there is a default value, use it
          // Otherwise, make the value blank
          if (typeof stage.options[key] !== 'undefined') {
            $scope.stageOptions.current[stage.id][key] = stage.options[key]
            $scope.stageOptions.saved[stage.id][key] = stage.options[key]

          } else if (typeof stage.schema.options[key].default !== 'undefined') {
            $scope.stageOptions.current[stage.id][key] = stage.schema.options[key].default.toString()
            $scope.stageOptions.saved[stage.id][key] = stage.schema.options[key].default.toString()

          } else {
            $scope.stageOptions.current[stage.id][key] = ''
            $scope.stageOptions.saved[stage.id][key] = ''
          }

        })

      })

    })

  $scope.saveOptions = function saveOptions(stageId) {

    // Save the options in the form to the cached "saved" values for comparison
    $scope.stageOptions.saved = _.cloneDeep($scope.stageOptions.current)

    // Send the current values to the server
    $http.patch('/api/stage/' + id, {
      options: $scope.stageOptions.current
    })

  }

  $scope.toggleOptions = function toggleOptions($event) {
    $($event.target).parent().parent().find('.panel-body').slideToggle(200)
  }

  // Delete Stage
  $scope.remove = (id) => {
    $http.delete('/api/stage/' + id)
    $state.go($state.$current, null, { reload: true })
  }

}]
