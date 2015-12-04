import createProjectModalController from './create-project-modal'

export default ['$rootScope', '$uibModal', function ($rootScope, $uibModal) {

  $rootScope.modal = {}

  $rootScope.modal.createProject = function createProject (callback) {

    var modalInstance = $uibModal.open({
      templateUrl: '/assets/js/templates/create-project-modal.html',
      controller: createProjectModalController
    })

    modalInstance.result.then(callback)

  }

}]
