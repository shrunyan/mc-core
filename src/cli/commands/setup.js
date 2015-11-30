let promptly = require('promptly')
let migrationRunner = require('../../db/migration-runner')

module.exports = (cmd, options) => {

    promptly.prompt('Name: ', function (err, value) {
        // err is always null in this case, because no validators are set
        console.log(value);
        migrationRunner(() => {
            process.exit(0);
        });
    });

};