#!/usr/bin/env node
'use strict'

let colors = require('colors/safe')

if (!process.version.startsWith('v5')) {
  console.log(colors.red('Mission Control must be run with node v5.0.0 (at minimum)'))
  process.exit(1)
}

let fs = require('fs')
let commands = {
  help: require('./commands/help'),
  setup: require('./commands/setup'),
  start: require('./commands/start'),
  stop: require('./commands/stop')
}

if (!fs.existsSync('package.json')) {
  console.error(colors.red('This script must be ran from a mission-control project'))
  process.exit(1)
}

// make sure this is being run from the mission-control package
let packageFile = JSON.parse(fs.readFileSync('package.json').toString())

if (packageFile.name !== 'mission-control') {
  console.error(colors.red('This script must be ran from a mission-control project'))
  process.exit(1)
}

// Get args after node example.js
let args = process.argv.slice(2)

// If there was no command specified, display the help
if (args.length === 0) {
  commands.help()
  process.exit(0)
}

switch (args[0]) {

  case 'setup':
    commands.setup()
    break

  case 'start':
    commands.start(args)
    break

  case 'stop':
    commands.stop(args)
    break

  case 'help':
    commands.help()
    break

  default:
    console.log('Invalid command')
    commands.help()

}
