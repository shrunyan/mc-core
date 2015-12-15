import createPipelineModal from './modals/create-pipeline'
import createProjectModal from './modals/create-project'

export default ['$rootScope', '$uibModal', ($rootScope, $uibModal) => {

  $rootScope.modal = {

    createProject: function createProject(cb) {
      let modal = $uibModal.open({
        templateUrl: '/assets/js/templates/modals/create-project.html',
        controller: createProjectModal
      })

      modal.result.then(cb)
    },

    createPipeline: function createPipeline(cb) {
      let modal = $uibModal.open({
        templateUrl: '/assets/js/templates/modals/create-pipeline.html',
        controller: createPipelineModal
      })

      modal.result.then(cb)
    }

  }
}]
