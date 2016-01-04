'use strict'

let test = require('tape')
let sinon = require('sinon')
let proxyquire = require('proxyquire').noCallThru()
let httpMocks = require('node-mocks-http')
let helper = proxyquire('../../src/api/controllers/basic-response-helper', {
  '../../db/connection': require('../mocks/mock.connection'),
  'tracer': require('../mocks/mock.tracer')
})

test('helper() exists', (t) => {
  // Arrange
  let keys = Object.keys(helper)

  // Assert
  t.equal(keys.length, 6)
  t.end()
})

test('helper.getList', (t) => {
  // Arrange
  let spy = sinon.spy(helper, 'getList')
  let req = httpMocks.createRequest()
  let res = httpMocks.createResponse()
  let table = 'test'

  // Act
  helper.getList(req, res, table)

  // Assert
  t.ok(spy.calledOnce, 'helper invoked getList')
  t.end()
})
