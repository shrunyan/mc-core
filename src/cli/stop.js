'use strict'

var pm2 = require('pm2');

module.exports = (args) => {


    // Connect or launch PM2
    pm2.connect(function(err) {

        // Start a script on the current folder
        pm2.delete('mission-control-web', function(err, proc) {
            if (err) throw new Error('err');

            // Disconnect to PM2
            pm2.disconnect(function() { process.exit(0) });

        });
    })

}

