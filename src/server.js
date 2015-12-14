'use strict'

let fs = require('fs')
let dotenv = require('dotenv')
let express = require('express')
let session = require('express-session')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let morgan = require('morgan')
let routes = require('./api/routes')
let extensions = require('./extensions/registry')

dotenv.config({silent: true})

let port = process.env.PORT || 3000
let host = process.env.HOST || 'localhost'
let app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.locals.ext = extensions.load()

// Load routes
routes(app)

let server = app.listen(port, () => {

  console.log('Mission Control listening at http://%s:%s', host, port)
  console.log('app locals', app.locals.ext)

})

module.exports = server
