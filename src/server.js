'use strict'

let express = require('express')
let session = require('express-session')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let morgan = require('morgan')
let routes = require('./api/routes')
let dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.load()

let port = process.env.PORT || 3000
let host = process.env.HOST || 'localhost'
let app = express()

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Load routes
routes(app)

app.listen(port, () => {

  console.log('Mission Control listening at http://%s:%s', host, port)

})
