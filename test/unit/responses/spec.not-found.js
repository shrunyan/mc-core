'use strict'

let test = require('tape')
let MockResponse = require('mock-express-response')
let notFound = require('../../../src/api/utils/responses/not-found')

test('http 404 response utility', (t) => {
  // Assign
  let response = new MockResponse()

  // Act
  notFound.call(response)

  // Assert
  t.ok(response.statusCode === 404, 'Responds with 404')
  t.ok(response._getJSON().message === 'Resource not found', 'Returned error message')
  t.end()
})
