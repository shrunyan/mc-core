import program from 'commander'
import setupCommand from './cli-commands/setup'

program
    .command('setup', 'runs setup assistant')
    .action(setupCommand)

program.parse(process.argv)