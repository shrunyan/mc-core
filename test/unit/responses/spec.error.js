'use strict'

let test = require('tape')
let MockResponse = require('mock-express-response')
let error = require('../../../src/api/utils/responses/error')

test('http 500 response utility', (t) => {
  // Assign
  let response = new MockResponse()

  // Act
  error.call(response)

  // Assert
  t.ok(response.statusCode === 500, 'Responds with 500')
  t.ok(response._getJSON().message === 'An error occurred.', 'Returned error message')
  t.end()
})
