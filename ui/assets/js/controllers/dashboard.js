export default ['$scope', '$http', 'socket', function($scope, $http, socket) {

  console.log('emitting ping on dashboard')
  socket.emit('ping', {data: 'yup'})

  $http.get('/api/pipeline-executions/recent').then(response => {
    $scope.pipelineExecutions = response.data.data.slice(0, 5)
  })

}]
