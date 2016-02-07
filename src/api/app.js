'use strict'

let dotenv = require('dotenv')
let express = require('express')
let rawBody = require('./middleware/raw-body')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let morgan = require('morgan')
let routes = require('./routes')

dotenv.config({silent: true})

let app = express()

app.use(rawBody)
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Load routes
routes(app)

module.exports = app
