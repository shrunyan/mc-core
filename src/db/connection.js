'use strict'

let dotenv = require('dotenv')
let knex = require('knex')

// Load environment variables from .env file
dotenv.load()

let connection = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  }
})

module.exports = connection
