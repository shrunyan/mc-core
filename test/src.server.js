'use strict'

var test = require('tape')
var request = require('request')
var app = require('../src/server')

test('404', function (t) {
  t.plan(1)

  var server = app.listen(3000)

  request('http://localhost:3000/non-existent/url/path', (err, res, body) => {

    if (err) {
      t.fail(err)
    }
    else if (404 === res.statusCode) {
      t.pass('Cool beans')
    }

    // server.close(() => process.exit(0))
  })

})
