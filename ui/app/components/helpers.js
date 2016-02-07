export default ['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {

  $rootScope.refresh = function refresh() {
    $state.go($state.current, $stateParams, {reload: true})
  }

}]
