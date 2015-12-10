'use strict'

var pm2 = require('pm2');
let devProcesses = require('./processes/processes-dev')
let colors = require('colors/safe')

module.exports = (args) => {

    let hammerTime = (args.length > 1 && args[1] === '--hammer-time');

    if (hammerTime) {
        console.log(colors.rainbow(require('./content/hammer-time-art')))
    }

    // Connect or launch PM2
    pm2.connect(function(err) {

        let promises = []

        // Note: we currently use the dev-processes process list for shutdown (so it will work regardless of
        // whether "mc start" or "mc start --dev" was used.
        devProcesses.forEach(config => {

            promises.push(new Promise((resolve, reject) => {

                pm2.delete(config.name, function(err, proc) {
                    if (err) {
                        if (err.msg !== 'process name not found') {
                            console.error(err)
                        }
                    }

                    resolve()

                })

            }))

        })

        // When all managed pm2 processes have been deleted, exit this one
        Promise.all(promises).then(() => {

            // Disconnect to PM2
            pm2.disconnect(function() {

                console.log(colors.green('✓ Mission Control Processes stopped'))
                process.exit(0)

            })

        })

    })

}
