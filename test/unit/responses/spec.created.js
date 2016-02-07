'use strict'

let test = require('tape')
let MockResponse = require('mock-express-response')
let created = require('../../../src/api/utils/responses/created')

test('http 201 response utility', function(t) {
  // Assign
  let response = new MockResponse()
  let data = {test: 'test'}

  // Act
  created.call(response, data)

  // Assert
  t.ok(response.statusCode === 201, 'Responds with 201')
  t.equal(JSON.stringify(response._getJSON().data), JSON.stringify(data))
  t.end()
})
