import _ from 'lodash'

export default ['$q', '$scope', '$http', '$stateParams', '$state', function($q, $scope, $http, $stateParams, $state) {

  // This must be predefined for ng-model
  // values as objects
  $scope.stageOptions = {
    metadata: {},
    current: {},
    saved: {}
  }

  // Default values for view state (form and section visibility)
  $scope.standardVariablesSectionShowing = false
  $scope.customVariablesSectionShowing = false
  $scope.createVarFormShowing = false

  /**
   * Toggle the visibility of the standard variables section
   */
  $scope.toggleStandardSection = function toggleStandardSection() {
    $scope.standardVariablesSectionShowing = !$scope.standardVariablesSectionShowing
  }

  /**
   * Toggle visibility of the custom variables section
   */
  $scope.toggleCustomSection = function toggleCustomSection() {
    $scope.customVariablesSectionShowing = !$scope.customVariablesSectionShowing
  }

  /**
   * Show the create variable form
   */
  $scope.showCreateVarForm = function showCreateVarForm() {
    $scope.resetCreateVarForm()
    $scope.createVarFormShowing = true
  }

  /**
   * Reset the values in the create var form
   */
  $scope.resetCreateVarForm = function resetCreateVarForm() {
    $scope.createVarFormValues = {
      pipeline_config_id: $stateParams.id,
      name: '',
      description: '',
      required: '1',
      default_value: ''
    }
  }

  /**
   * "Cancel" var creation (closes the form)
   */
  $scope.cancelCreateVar = function cancelCreateVar() {
    $scope.createVarFormShowing = false
  }

  /**
   * Actual create of a new variable (typically triggered by the create var form)
   */
  $scope.createVar = function createVar() {

    $scope.createVarFormShowing = false

    // If the var is required, make the default blank (since there shouldn't be a default value)
    if ($scope.createVarFormValues.required === '1') {
      $scope.createVarFormValues.default_value = ''
    }

    // Create on server, then reset the create variable form and reload the variables data
    $http.post('/api/pipelines/' + $stateParams.id + '/variables', $scope.createVarFormValues).then(() => {
      $scope.resetCreateVarForm()
      $scope.loadVariables()
    })
  }

  /**
   * Load the pipeline and the related project
   */
  $scope.loadPipelinesAndProject = function loadPipelinesAndProject() {
    $http.get('/api/pipelines/' + $stateParams.id).then(response => {
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
    $http.get('/api/pipelines/' + $stateParams.id + '/variables').then(response => {
      $scope.variables = response.data.data
    })
  }

  /**
   * Loads Stage Data
   */
  $scope.loadStages = function loadStages() {

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
          // - one for metadata
          $scope.stageOptions.current[stage.id] = {}
          $scope.stageOptions.saved[stage.id] = {}
          $scope.stageOptions.metadata[stage.id] = {}

          // For each option that exits in the stage type...
          Object.keys(stage.schema.options).forEach((key) => {

            let optionValue

            // If the user has specified value, use that
            // Otherwise, if there is a default value, use it
            // Otherwise, make the value blank
            if (typeof stage.options[key] !== 'undefined') {
              optionValue = stage.options[key].toString()

            } else if (typeof stage.schema.options[key].default !== 'undefined') {
              optionValue = stage.schema.options[key].default.toString()

            } else {
              optionValue = ''
            }

            $scope.stageOptions.current[stage.id][key] = optionValue
            $scope.stageOptions.saved[stage.id][key] = optionValue
            $scope.stageOptions.metadata[stage.id][key] = {
              name: stage.schema.options[key].name,
              description: stage.schema.options[key].description
            }

          })

        })

      })
  }

  /**
   * Save options for a stage
   *
   * @param stageId
   */
  $scope.saveOptions = function saveOptions(stageId) {

    // Save the options in the form to the cached "saved" values for comparison
    $scope.stageOptions.saved[stageId] = _.cloneDeep($scope.stageOptions.current[stageId])

    // Send the current values to the server
    $http.patch('/api/stage/' + stageId, {
      options: $scope.stageOptions.current[stageId]
    })

  }

  /**
   * Toggles the visibility of the options section for a stage
   *
   * @param {object} $event Angular event object, to operate on html element
   */
  $scope.toggleOptions = function toggleOptions($event) {
    $($event.target).parent().parent().find('.panel-body').slideToggle(200)
  }

  /**
   * Delete Stage (and reload stages)
   *
   * @param id
   */
  $scope.removeStage = (id) => {
    $http.delete('/api/stage/' + id)
    $scope.loadStages()
  }

  $scope.updateVar = () => {}

  /**
   * Deletes a pipeline variable (and removes it from the scope array/obj locally)
   *
   * @param {object} variable Full variable object (typically from $scope.variables)
   */
  $scope.deleteVar = (variable) => {

    // Confirm
    if (confirm('Are you sure you want to delete variable "' + variable.name + '"?')) {

      // Delete on server
      $http.delete('/api/pipelines/' + $stateParams.id + '/variables/' + variable.id)

      // Delete locally
      $scope.variables.splice($scope.variables.indexOf(variable), 1)

    }

  }

  // Initialize view
  $scope.loadStages()
  $scope.loadPipelinesAndProject()
  $scope.loadVariables()

}]
