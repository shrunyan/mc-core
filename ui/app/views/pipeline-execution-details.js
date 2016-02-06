export default ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {

  $http.get('/api/pipeline-executions/' + $stateParams.id + '/with-details').then(function(response) {

    $scope.execution = response.data.data
    console.log(response.data.data)

    $http.get('/api/projects/' + response.data.data.config_snapshot.pipeline.project_id).then(response => {
      $scope.project = response.data.data
    })

  })

  $scope.toggleDetails = function toggleDetails($event) {
    let $button = $($event.target)

    // Swap the text on the button
    let existingText = $button.find('span').text()
    let newText = (existingText === 'Show') ? 'Hide' : 'Show'
    $button.find('span').text(newText)

    // Swap the icon on the button
    $button.find('i').toggleClass('fa-angle-down fa-angle-up')

    // Show/hide the area below
    $button.parent().parent().next().toggle()

  }

}]
