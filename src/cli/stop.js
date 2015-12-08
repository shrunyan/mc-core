'use strict'

var pm2 = require('pm2');
let processes = require('./processes')

module.exports = (args) => {


    // Connect or launch PM2
    pm2.connect(function(err) {

        let promises = []

        processes.forEach(config => {

            promises.push(new Promise((resolve, reject) => {

                pm2.delete(config.name, function(err, proc) {
                    if (err) throw new Error('err');

                    // Disconnect to PM2
                    pm2.disconnect(function() {
                        resolve()
                    });

                });
            }))

        })

        // When all managed pm2 processes have been deleted, exit this one
        Promise.all(promises).then(() => {
            process.exit(0)
        })

    })

}

