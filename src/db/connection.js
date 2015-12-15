'use strict'

let dotenv = require('dotenv')
let knex = require('knex')

dotenv.config({silent: true})

let connection

if (process.env.NODE_ENV === 'test') {
  connection = {}
} else {
  connection = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    }
  })
}

module.exports = connection
