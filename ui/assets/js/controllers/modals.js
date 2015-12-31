import createPipelineModal from './modals/create-pipeline'
import createProjectModal from './modals/create-project'
import createCheckModal from './modals/create-check'
import createStageModal from './modals/create-stage'

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
            templateUrl: '/assets/js/templates/modals/create-project.html',
            controller: createProjectModal
          }

        case 'pipeline':
          return {
            templateUrl: '/assets/js/templates/modals/create-pipeline.html',
            controller: createPipelineModal,
            resolve: {
              data: () => {
                return dataToPass
              }
            }
          }

        case 'check':
          return {
            templateUrl: '/assets/js/templates/modals/create-check.html',
            controller: createCheckModal
          }

        case 'stage':
          return {
            templateUrl: '/assets/js/templates/modals/create-stage.html',
            controller: createStageModal,
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
