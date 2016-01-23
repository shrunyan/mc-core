import createPipelineModal from './modals/create-pipeline'
import createPipelineExecutionModal from './modals/create-pipeline-execution'
import createProjectModal from './modals/create-project'
import createCheckModal from './modals/create-check'
import addStageModal from './modals/add-stage'

export default ['$rootScope', '$uibModal', ($rootScope, $uibModal) => {

  $rootScope.modal = {

    open: function open(modal, cb, dataToPass) {

      cb = cb || function() {}
      dataToPass = dataToPass || {}

      $uibModal
        .open(this.getConfig(modal, dataToPass))
        .result
        .then(cb)
    },

    getConfig: function getConfig(modal, dataToPass) {
      switch (modal) {

        case 'project':
          return {
            templateUrl: '/app/components/modals/create-project.html',
            controller: createProjectModal
          }

        case 'pipeline':
          return {
            templateUrl: '/app/components/modals/create-pipeline.html',
            controller: createPipelineModal,
            resolve: {
              data: () => {
                return dataToPass
              }
            }
          }

        case 'pipeline-execution':
          return {
            templateUrl: '/app/components/modals/create-pipeline-execution.html',
            controller: createPipelineExecutionModal,
            resolve: {
              data: () => {
                return dataToPass
              }
            }
          }

        case 'check':
          return {
            templateUrl: '/app/components/modals/create-check.html',
            controller: createCheckModal
          }

        case 'stage':
          return {
            templateUrl: '/app/components/modals/add-stage.html',
            controller: addStageModal,
            resolve: {
              data: () => {
                return dataToPass
              }
            }
          }

      }
    }

  }
}]
