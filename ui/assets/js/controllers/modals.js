import createPipelineModal from './modals/create-pipeline'
import createProjectModal from './modals/create-project'
import createCheckModal from './modals/create-check'

export default ['$rootScope', '$uibModal', ($rootScope, $uibModal) => {

  $rootScope.modal = {

    open: function open (modal, cb) {
      $uibModal
        .open(this.getConfig(modal))
        .result
        .then(cb)
    },

    getConfig: function getConfig (modal) {
      switch (modal) {
        case 'project':
          return {
            templateUrl: '/assets/js/templates/modals/create-project.html',
            controller: createProjectModal
          }
        case 'pipeline':
          return {
            templateUrl: '/assets/js/templates/modals/create-pipeline.html',
            controller: createPipelineModal
          }
        case 'check':
          return {
            templateUrl: '/assets/js/templates/modals/create-check.html',
            controller: createCheckModal
          }
      }
    },

    createProject: function createProject (cb) {
      let modal = $uibModal.open({
        templateUrl: '/assets/js/templates/modals/create-project.html',
        controller: createProjectModal
      })

      modal.result.then(cb)
    },

    createPipeline: function createPipeline (cb) {
      let modal = $uibModal.open({
        templateUrl: '/assets/js/templates/modals/create-pipeline.html',
        controller: createPipelineModal
      })

      modal.result.then(cb)
    }

  }
}]
