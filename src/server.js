'use strict'

let app = require('./api/app')
let fs = require('fs')

let port = process.env.PORT || 3000
let host = process.env.HOST || 'localhost'
let httpsOn = (typeof process.env.HTTPS === 'string' && process.env.HTTPS.toUpperCase() === 'ON')
let server

if (httpsOn) {

  const options = {
    key: fs.readFileSync(process.env.HTTPS_KEY),
    cert: fs.readFileSync(process.env.HTTPS_CERT)
  }

  server = require('https').createServer(options, app).listen(port, () => {
    console.log('Mission Control listening at https://%s:%s', host, port)
  })

} else {
  server = require('http').createServer(app).listen(port, () => {
    console.log('Mission Control listening at http://%s:%s', host, port)
  })

}

// Set up socket handling
require('./api/socket-handler')(server)

module.exports = server
