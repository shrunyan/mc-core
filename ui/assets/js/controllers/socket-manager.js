export default ['$rootScope', 'socket', function($rootScope, socket) {

  console.log('in socket controller')

  console.log('sending ping')
  socket.emit('ping', {data: 'yup'})

  socket.emit('auth', {})

  socket.on('pong', function() {
    console.log('got pong from server')
  })

  socket.on('authorized_event', function(data) {
    console.log('received authorized_event with data:')
    console.log(data)
  })

}]
