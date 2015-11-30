let connection = require('../../db/connection')
let migrationConfig = require('../../db/migration-config')

module.exports = (cmd, options) => {

    if (typeof cmd === "undefined") {
        console.log('missing last argument "name" for new migration')
        process.exit(0);
    }

    connection.migrate.make(cmd, migrationConfig).then(function() {
        console.log('Migration created');
        process.exit(0);
    });


};
