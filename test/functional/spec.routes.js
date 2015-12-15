'use strict'

const REQ_ENDPOINT = 'http://localhost:3000'

// let app = require('../../src/api/app')
let request = require('supertest')
let test = require('tape')
let session = request.agent(REQ_ENDPOINT)
let report = (t, err, res, expected) => {
  if (err) {
    t.fail(err, 'Check your development server is running')
  } else if (expected === res.status) {
    t.pass('recieved expected status: ' + res.status)
  } else {
    t.fail('unexpected status: ' + res.status)
  }
}

test('GET: /api/user', (t) => {
  t.plan(1)

  request(REQ_ENDPOINT)
    .get('/api/user')
    .end((err, res) => {
      report(t, err, res, 401)
    })
})

test('POST: /login', (t) => {
  t.plan(1)

  session
    .post('/login')
    .send({
      'email': 'stuart',
      'password': 'test'
    })
    .end((err, res) => {
      report(t, err, res, 200)
    })
})

test('GET: /api/projects', (t) => {
  t.plan(1)

  session
    .get('/api/projects')
    .end((err, res) => report(t, err, res, 200))
})

test('GET: /api/pipelines', (t) => {
  t.plan(1)

  session
    .get('/api/pipelines')
    .end((err, res) => report(t, err, res, 200))
})

test('GET: /api/pipeline-executions/recent', (t) => {
  t.plan(1)

  session
    .get('/api/pipeline-executions/recent')
    .end((err, res) => report(t, err, res, 200))
})
