export default ['$rootScope', 'socket', function($rootScope, socket) {

  $rootScope.activePipelines = {initial_state: 'none'}

  // When we receive a test authorized_event, log it
  socket.on('client_side_log', function(data) {
    console.log('Socket log: ' + data.message)
  })

  // When we received an update active pipelines event, update it in our root scope
  // Note, there are two ways this happens
  // 1. When we emit a get_active_pipelines event (like above), it will respond with an update_active_pipelines event
  // 2. When an event happens server side (like a stage finishing), it will publish an update to us
  socket.on('update_active_pipelines', (data) => {
    console.log('received updated active pipelines data')
    $rootScope.activePipelines = data
  })

}]
