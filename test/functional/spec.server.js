'use strict'

// let proxyquire = require('proxyquire')
// let request = require('supertest')
// let test = require('tape')
// // let app = require('../../src/api/app')

// let appMock = {
//   '../../queues/queue': {
//     sendMessage: (msg) => console.log('queue message', msg)
//   }
// }

// test('server should handle non-existent path with 404', function(t) {

//   let app = proxyquire('../../queues/queue', appMock)

//   t.plan(1)

//   request(app)
//     .get('/non-existent/url/path')
//     .expect(404)
//     .end((err, res) => {
//       t.error(err, 'No error')
//     })

// })
