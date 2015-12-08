#!/usr/bin/env node
'use strict'

let fs = require('fs')
let program = require('commander')
let colors = require('colors/safe')
let pkg = require('./package.json')

const ENV_FILE = __dirname + '/../../.env'

// Check .env file exits
fs.access(ENV_FILE, function (err) {
  if (err) {
    console.log(colors.red('We could not load your .env file.'))
    console.log(colors.yellow('Check these requirements before proceding.'))

    // .env instructions
    console.log(colors.white('1) .env file exists'))
    console.log(colors.grey('Use the .env.example file to get started.'))

    // Redis instructions
    console.log(colors.white('2) Redis is installed and running'))
    console.log(colors.grey('If running locally on OSX use brew to install and start Redis.'))

    // MySQL instructions
    console.log(colors.white('3) MySQL is installed and running'))
    console.log(colors.grey('If running locally on OSX use brew to install and start MySQL'))
  } else {
    program
      .version(pkg.version)
      .usage('<command> [options]')
      .command('setup', 'runs setup assistant')
      // .command('migration', 'make a new migration')
      // .command('run', 'run migrations')
      .parse(process.argv)
  }
})
