/**
 * Setup command
 *
 * This command is written (and should continue to be written) as idempotent.
 * It should be able to be run over and over to complete installation, even if cancelled by the user at a given step.
 */
// let promptly = require('promptly')
// let migrationRunner = require('../../db/migration-runner')

module.exports = (cmd, options) => {

    // Create a .env file if there is not one
    // If we create one, inform the user they should configure it now (and exit)
    // Also notify them to install mysql and redis if they haven't yet (and they plan to do so locally)

    // Test the redis connection

    // Test the mysql database connection

    // Run migrations

    // Check if there are any users in the users table
    // If not, walk the user through creating an admin user (interactively)

    // promptly.prompt('Name: ', function (err, value) {
    //    // err is always null in this case, because no validators are set
    //    console.log(value);
    //    migrationRunner(() => {
    //        process.exit(0);
    //    });
    // });
}
