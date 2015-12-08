'use strict'

var nodemon = require('nodemon');

module.exports = () => {

    /*
     * Run server
     */

    nodemon({
        script: 'node_modules/mc-core/src/server.js',
        ext: 'js json'
    })

    //nodemon.on('start', function () {
    //    console.log('App has started')
    //
    //}).on('quit', function () {
    //    console.log('App has quit')
    //
    //}).on('restart', function (files) {
    //    console.log('App restarted due to: ', files)
    //
    //})
    
}

