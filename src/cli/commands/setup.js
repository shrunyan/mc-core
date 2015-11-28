let promptly = require('promptly')

module.exports = (cmd, options) => {

    console.log('Setup command')

    promptly.prompt('Name: ', function (err, value) {
        // err is always null in this case, because no validators are set
        console.log(value);
    });

};