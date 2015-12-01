let RedisSMQ = require('rsmq')
let rsmq = new RedisSMQ({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, ns: 'mission_control'})

rsmq.createQueue({qname: 'jobs'}, function (err, resp) {
  if (resp === 1) {
    //console.log('queue created')
  }
})

module.exports = rsmq