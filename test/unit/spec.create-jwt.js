'use strict'

const test = require('tape')
const sign = require('../../src/security/jwt/sign')
const TEST_USER_ID = 12

// Provide a test secret key
process.env.SECRET_KEY = 'abcdefg'

test('create jwt', (t) => {
  const user = sign(TEST_USER_ID)
  t.equal(typeof user, 'string')
  t.end()
})

test('fails creating jwt', (t) => {
  process.env.SECRET_KEY = new Array()
  let user = sign(TEST_USER_ID)
  t.ok(user instanceof Error)

  process.env.SECRET_KEY = 'abcdefg'
  t.end()
})

test('jwt is unique by unix timestamp', (t) => {
  t.plan(1)

  const user1 = sign(TEST_USER_ID)
  setTimeout(() => {
    const user2 = sign(TEST_USER_ID)
    t.notEqual(user1, user2)
  }, 1000)
})
