'use strict';

let connection = require('./connection')
let migrationConfig = require('./migration-config')

module.exports = (onCompleteCallback) => {

  connection.migrate.latest(migrationConfig)
    .then(function () {

      onCompleteCallback()

    })

}
