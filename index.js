#!/usr/bin/env node
'use strict'

let fs = require('fs')
let commands = {
    help: require('./src/cli/help'),
    setup: require('./src/cli/setup'),
    dev: require('./src/cli/dev'),
    run: require('./src/cli/dev')
}

// make sure this is being run from the mission-control package
let packageFile = JSON.parse(fs.readFileSync('package.json').toString())

if (packageFile.name !== 'mission-control') {
    console.error('This script must be ran from a mission-control project')
    process.exit(1)
}

// Get args after node example.js
let args = process.argv.slice(2)

switch (args) {

    case (args[0] === 'dev'):
        commands.dev()
        break

    case (args[0] === 'setup'):
        commands.setup()
        break

    case (args[0] === 'run'):
        commands.run()
        break

    case (args[0] === 'help'):
        commands.help()
        break

    default:
        console.log('Invalid command')
        commands.help()

}
