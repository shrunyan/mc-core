'use strict'

let request = require('supertest')
let test = require('tape')
// let app = require('../../src/api/app')
let report = (t, err, res, expected) => {
  if (err) {
    t.fail(err)
  } else if (expected === res.status) {
    t.pass('recieved expected status: ' + res.status)
  } else {
    t.fail('unexpected status: ' + res.status)
  }
}

// const REQ_ENDPOINT = app.listen(3000)
const REQ_ENDPOINT = 'http://localhost:3000'

test('GET: /api/user', (t) => {
  t.plan(1)

  request(REQ_ENDPOINT)
  .get('/api/user')
  .end((err, res) => {
    report(t, err, res, 401)
  })
})

test('GET: /login', (t) => {
  t.plan(1)

  request(REQ_ENDPOINT)
    .post('/login')
    .send({
      'email': 'stuart',
      'password': 'test'
    })
    .end((err, res) => {
      report(t, err, res, 200)
    })
})

test.skip('GET: /api/projects', (t) => {
  t.plan(1)

  request(REQ_ENDPOINT)
    .get('/api/projects')
    .end((err, res) => report(t, err, res, 200))

})
