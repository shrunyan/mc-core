'use strict'

var pm2 = require('pm2');
let processes = require('./processes')

module.exports = (args) => {

    let hammerTime = (args.length > 1 && args[1] === '--hammer-time');

    if (hammerTime) {
        console.log(require('./stop-hammer-time-art'))
    }

    // Connect or launch PM2
    pm2.connect(function(err) {

        let promises = []

        processes.forEach(config => {

            promises.push(new Promise((resolve, reject) => {

                pm2.delete(config.name, function(err, proc) {
                    if (err) {
                        console.error(err.message)
                    }

                    resolve()

                })
            }))

        })

        // When all managed pm2 processes have been deleted, exit this one
        Promise.all(promises).then(() => {

            // Disconnect to PM2
            pm2.disconnect(function() {

                console.log('Mission Control Processes stopped.')
                process.exit(0)

            })

        })

    })

}

