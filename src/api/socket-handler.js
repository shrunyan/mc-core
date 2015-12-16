'use strict'

let cookie = require('cookie')
let jwt = require('jsonwebtoken')
let io

// Tests whether the user is authorized and in the authorized room
let userIsInAuthorizedRoom = (socketId) => {

  // If the room doesn't even exist, return false
  if (typeof io.sockets.adapter.rooms['authorized'] === 'undefined') {
    return false
  }
  return (typeof io.sockets.adapter.rooms['authorized'][socketId] !== 'undefined')
}

/**
 * Attempts to authenticate a socket connection via a JWT cookie
 * @param socket
 */
let authenticateSocketUser = (socket) => {
  try {

    let parsedCookies = cookie.parse(socket.handshake.headers['cookie'])

    if (typeof parsedCookies.mc_jwt !== 'undefined') {

      let decoded = jwt.verify(parsedCookies.mc_jwt, process.env.SECRET_KEY)

      if (typeof decoded.user_id !== 'undefined') {

        console.log('jwt found and validated')

        // Join them to the authorized room (unless they are already in there)
        if (!userIsInAuthorizedRoom(socket.id)) {
          console.log('user is not already in the authorized room, joining them to it now')
          socket.join('authorized')
        } else {
          console.log('user is already in the authorized room')
        }
      }

    }

  } catch (err) {
    console.log(err)
  }

}

module.exports = (server) => {

  io = require('socket.io')(server)

  // As a test, we'll emit an event to only authorized users every 5 seconds
  setInterval(function() {
    io.to('authorized').emit('authorized_event', {message: 'only authorized users should see this'})
  }, 5000)

  io.on('connection', (socket) => {

    console.log('SIO: User Connected: ' + socket.id)

    // Attempt to authenticate the user on connection (via their JWT)
    authenticateSocketUser(socket)

    socket.on('ping', function(data) {
      console.log('received ping, sending pong')
      socket.emit('pong', {server_data: 'nothing'})
    })

    socket.on('get_active_pipelines', function() {

      // If the socket.id is in the room 'authorized', emit an event back to them
      if (userIsInAuthorizedRoom(socket.id)) {
        io.sockets.socket(socket.id).emit('update_active_pipelines', {})
      }

    })

    socket.on('disconnect', function() {
      console.log('SIO: User Disconnected: ' + socket.id)
    })

  })

}
