var express = require('express');
var app = express();
require('./src/routes')(app);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Mission Control listening at http://%s:%s', host, port);
});