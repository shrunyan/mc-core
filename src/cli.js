let program = require('commander')

// Setup command
program
    .command('setup')
    .description('runs setup assistant')
    .action(require('./cli/commands/setup'))

// Create Migration command
program
    .command('create_migration [name]')
    .description('make a new migration')
    .action(require('./cli/commands/make-migration'))

// Run Migrations command
program
    .command('migrate')
    .description('run migrations')
    .action(require('./cli/commands/run-migrations'))

program.parse(process.argv)
