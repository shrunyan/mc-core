'use strict'

let pm2 = require('pm2');
let processes = require('./processes')

module.exports = (args) => {

    let devMode = (args.length > 1 && args[1] === '--dev');

    // If we are in dev mode, add additional options
    if (devMode) {
        processes.forEach((proccesConfig, index) => {
            processes[index].watch = ["node_modules/mc-core"]
            processes[index].ignore_watch = ["node_modules/mc-core/node_modules"]
        })
    }
    // Connect or launch PM2
    pm2.connect(function(err) {

        // Start our processes
        pm2.start(processes, function(err, proc) {
            if (err) throw new Error('err');

            // Disconnect to PM2 (and exit this script after)
            pm2.disconnect(function() {
                process.exit(0)
            });

        });

    })

}

