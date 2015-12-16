'use strict'

module.exports = function(socket) {

  console.log('a user connected')

  socket.on('ping', function(data) {
    console.log('received ping, sending pong')
    socket.emit('pong', {server_data: 'nothing'})
  })

  socket.on('disconnect', function() {
    console.log('user disconnected')
  })

}
