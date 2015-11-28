process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
});

//import program from 'commander'
//import setupCommand from './cli/commands/setup'
//
//console.log('loaded');
//
//console.log(process.argv.length);
//
//program
//    .version('0.0.1')
//    .command('setup', 'runs setup assistant')
//    .action(setupCommand)
//
//program.parse(process.argv)
//
//console.log('post exec');