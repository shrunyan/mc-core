'use strict'

let cookie = require('cookie')
let jwt = require('jsonwebtoken')
let RSMQWorker = require('rsmq-worker')
let getActivePipelines = require('../core/pipelines/get-active-pipelines')
let io

/**
 * Tests whether the user is authorized and in the authorized room
 *
 * @param socketId
 * @returns {boolean}
 */
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

        // Either way, if we made it here, broadcast the initial (pipeline) data
        emitActivePipelinesToSpecificSocket(socket.id)
      }

    }

  } catch (err) {
    console.log(err)
  }

}

let emitActivePipelinesToSpecificSocket = (socketId) => {

  getActivePipelines((data) => {
    io.sockets.connected[socketId].emit('update_active_pipelines', data)
  })

}

let emitActivePipelinesToAllAuthorizedSockets = () => {
  getActivePipelines((data) => {
    io.sockets.in('authorized').emit('update_active_pipelines', data)
  })
}

// On update_active_pipelines rsmq event, publish ws event
let worker = new RSMQWorker('pipeline_updates', {
  redisPrefix: 'mission_control',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  interval: 1 // using a more aggressive polling rate
})

worker.on('message', emitActivePipelinesToAllAuthorizedSockets)
worker.start()

module.exports = (server) => {

  io = require('socket.io')(server)

  // As a test, we'll emit an event to only authorized users every 5 seconds
  //setInterval(() => {
  //  io.emit('client_side_log', {message: 'all users should see this'})
  //  io.to('authorized').emit('client_side_log', {message: 'only authorized users should see this'})
  //}, 5000)

  io.on('connection', (socket) => {

    console.log('SIO: User Connected: ' + socket.id)

    // Attempt to authenticate the user on connection (via their JWT)
    authenticateSocketUser(socket)

    socket.on('disconnect', function() {
      console.log('SIO: User Disconnected: ' + socket.id)
    })

  })

}
