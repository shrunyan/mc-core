'use strict'

let test = require('tape')
// let sinon = require('sinon')
// let proxyquire = require('proxyquire').noCallThru()
let Worker = require('../../src/workers/worker')
// let httpMocks = require('node-mocks-http')
// let helper = proxyquire('../../src/api/controllers/basic-response-helper', {
//   '../../db/connection': require('../mocks/mock.connection'),
//   'tracer': require('../mocks/mock.tracer')
// })

test('worker factory', (t) => {
  // Assign
  let name = 'test'
  let worker = new Worker(name)

  // Act
  // console.log(worker)
  // worker.start()
  // worker.stop()

  // Assert
  t.ok(typeof Worker === 'function', 'returns a function')
  t.ok(worker.queuename === name, 'properly set queue name')
  t.end()
})

// test('helper.getList', (t) => {
//   // Arrange
//   let spy = sinon.spy(helper, 'getList')
//   let req = httpMocks.createRequest()
//   let res = httpMocks.createResponse()
//   let table = 'test'

//   // Act
//   helper.getList(req, res, table)

//   // Assert
//   t.ok(spy.calledOnce, 'helper invoked getList')
//   t.end()
// })
