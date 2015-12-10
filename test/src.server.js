'use strict'

let request = require('supertest');

describe('basic server tests', function () {
  var server;

  beforeEach(function () {
    server = require('../src/server');
  });

  afterEach(function () {
    server.close();
  });

  it('404 for non-existent paths', function testPath(done) {
    request(server)
      .get('/non-existent/url/path')
      .expect(404, done);
  });

});