let migrationRunner = require('../../db/migration-runner')


module.exports = (cmd, options) => {

    console.log('Running migrations')

    migrationRunner(() => {
        process.exit(0);
    });

}