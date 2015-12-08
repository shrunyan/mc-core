'use strict'

var pm2 = require('pm2');

module.exports = (args) => {

    let devMode = (args.length > 1 && args[1] === '--dev');

    // node_modules/mc-core/src/server.js
    // node_modules/mc-core/src/worker-pipelines.js

    // Connect or launch PM2
    pm2.connect(function(err) {

        let webProcessConfig = {
            name: 'mission-control-web',
            "watch": ["node_modules/mc-core"],
            "ignore_watch" : ["node_modules/mc-core/node_modules"]
        }

        // Start a script on the current folder
        pm2.start('node_modules/mc-core/src/server.js', webProcessConfig, function(err, proc) {
            if (err) throw new Error('err');

            // Disconnect to PM2
            pm2.disconnect(function() { process.exit(0) });

        });
    })

}

