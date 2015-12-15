'use strict'

let request = require('supertest')
let test = require('tape')
let app = require('../../src/api/app')

test('404 response', function(t) {
  t.plan(1)

  request(app)
    .get('/non-existent/url/path')
    .end((err, res) => {
      t.error(err, 'No error');
    })
})
