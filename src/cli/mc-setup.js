#!/usr/bin/env node
'use strict';

require('dotenv').load({
  path: __dirname + '/../../.env'
})

let colors = require('colors/safe')
let knex = require('knex')

const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_NAME = process.env.DB_NAME || 'mission_control'

// Check options
if (!DB_USER) {
  console.log('Missing the MySql username, DB_USER, from .env file.')
  process.exit(1)
} else if (!DB_PASS) {
  console.log('Missing the MySql pasword, DB_PASS, from .env file.')
  process.exit(1)
}

// Setup MySql
knex({
  client: 'mysql',
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
  }
})

// test connection

// Setup Redis
  // test connection

// Check if there are any users in the users table
  // If not, walk the user through creating an admin user (interactively)
  // var salt = bcrypt.genSaltSync(10)
  // var result = bcrypt.hashSync("pass")
