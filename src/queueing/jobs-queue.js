let RedisSMQ = require('rsmq');
let rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "mission_control"} );

rsmq.createQueue({qname:"jobs"}, function (err, resp) {
  if (resp===1) {
    console.log("queue created")
  }
});

module.exports = rsmq;