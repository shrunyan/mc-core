import _ from 'lodash'

export default ['$q', '$scope', '$http', '$stateParams', '$state', function($q, $scope, $http, $stateParams, $state) {

  // This must be predefined for ng-model
  // values as objects
  $scope.stageOptions = {
    metadata: {},
    current: {},
    saved: {}
  }
  $scope.stageOutputs = {
    metadata: {},
    current: {},
    saved: {}
  }

  // Default values for view state (form and section visibility)
  $scope.standardVariablesSectionShowing = false
  $scope.customVariablesSectionShowing = false
  $scope.createVarFormShowing = false
  $scope.editVarFormShowing = false
  $scope.editVarFormValues = {}
  $scope.editVarId = null

  /**
   * Opens the edit var form
   *
   * @param variable
   */
  $scope.editVar = function editVar(variable) {

    // Copy the values of the variable into the edit form
    $scope.editVarFormValues = {
      name: variable.name,
      description: variable.description,
      required: variable.required.toString(),
      default_value: variable.default_value
    }

    // Note which one we are editing
    $scope.editVarId = variable.id

    //
    $scope.editVarFormShowing = true

  }

  /**
   * Cancel making edits for a form var
   */
  $scope.cancelVarEdits = function cancelVarEdits() {
    $scope.editVarFormShowing = false
  }

  /**
   * Save edits to a variable (and reload variables)
   */
  $scope.saveVarEdits = () => {

    // If the var is required, make the default blank (since there shouldn't be a default value)
    if ($scope.editVarFormValues.required === '1') {
      $scope.editVarFormValues.default_value = ''
    }

    // Coerce the string required value into an integer
    $scope.editVarFormValues.required = parseInt($scope.editVarFormValues.required, 10)

    // Send changes to server, then refresh variables
    $http.patch('/api/pipelines/' + $stateParams.id + '/variables/' + $scope.editVarId, $scope.editVarFormValues)
      .then(() => {
        $scope.loadVariables()
      })

    // Hide the edit form
    $scope.editVarFormShowing = false
  }

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
          Object.keys(stage.schema.options).forEach(key => {

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

          // Set up holder objects
          // - one for the "last saved" value
          // - one for the current (bound) form value
          // - one for metadata
          $scope.stageOutputs.current[stage.id] = {}
          $scope.stageOutputs.saved[stage.id] = {}
          $scope.stageOutputs.metadata[stage.id] = {}

          // for each output that a stage type provides...
          if (typeof stage.schema.outputs !== 'undefined' && Object.keys(stage.schema.outputs).length > 0) {

            Object.keys(stage.schema.outputs).forEach(key => {

              // Check if the stage configuration has mapped that output to a pipeline variable
              // If so, populate it
              // Regardless, provide the output key...
              let outputMappingValue

              if (typeof stage.output_map === 'object' && stage.output_map !== null && typeof stage.output_map[key] !== 'undefined') {
                outputMappingValue = stage.output_map[key]
              } else {
                outputMappingValue = ''
              }

              $scope.stageOutputs.current[stage.id][key] = outputMappingValue
              $scope.stageOutputs.saved[stage.id][key] = outputMappingValue
              $scope.stageOutputs.metadata[stage.id][key] = stage.schema.outputs[key].description

            })

          }

        })

      })
  }

  /**
   * Save options for a stage
   *
   * @param stageId
   */
  $scope.saveOptionsAndOutputs = function saveOptionsAndOutputs(stageId) {

    // TODO: validate that stage output variable names are valid mission control variable names
    // (only lowercase, alphanumeric, and underscores)

    // Save the options in the form to the cached "saved" values for comparison
    $scope.stageOptions.saved[stageId] = _.cloneDeep($scope.stageOptions.current[stageId])

    // Do the same with output mappings
    $scope.stageOutputs.saved[stageId] = _.cloneDeep($scope.stageOutputs.current[stageId])

    // Send the current values to the server
    $http.patch('/api/stage/' + stageId, {
      options: $scope.stageOptions.current[stageId],
      output_map: $scope.stageOutputs.current[stageId]
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
