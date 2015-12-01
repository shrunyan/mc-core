let RSMQWorker = require('rsmq-worker')
let dotenv = require('dotenv')

dotenv.load()

let worker = new RSMQWorker('jobs', {
  redisPrefix: 'mission_control',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

worker.on('message', function (msg, next) {
  // process your message
  console.log('message received')
  console.log(msg)
  next()
})

// optional error listeners
worker.on('error', function (err, msg) {
  console.log("ERROR", err, msg.id)
})

worker.on('exceeded', function (msg) {
  console.log("EXCEEDED", msg.id)
})

worker.on('timeout', function (msg) {
  console.log("TIMEOUT", msg.id, msg.rc)
})

worker.start()
