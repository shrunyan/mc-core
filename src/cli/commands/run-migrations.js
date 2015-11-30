let migrationRunner = require('../../db/migration-runner')

module.exports = (cmd, options) => {
  console.log('Running migrations')
  process.exit(0)
  // migrationRunner(() => {
  //    process.exit(0);
  // });
}
