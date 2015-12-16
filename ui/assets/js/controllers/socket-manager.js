export default ['$rootScope', 'socket', function($rootScope, socket) {

  console.log('in socket controller')

  console.log('sending ping')
  socket.emit('ping', {data: 'yup'})

  socket.on('pong', function() {
    console.log('got pong from server')
  })

}]
