let program = require('commander')
let setupCommand = require('./cli/commands/setup')

// Setup command
program
    .command('setup')
    .description('runs setup assistant')
    .action(setupCommand)


program.parse(process.argv)
