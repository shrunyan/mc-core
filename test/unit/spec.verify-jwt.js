'use strict'

const test = require('tape')
const sign = require('../../src/security/jwt/sign')
const verify = require('../../src/security/jwt/verify')
const TEST_USER_ID = 12

// Provide a test secret key
process.env.SECRET_KEY = 'abcdefg'

test('verify jwt', (t) => {
  t.plan(1)

  verify(sign(TEST_USER_ID))
    .then(t.pass)
    .catch(t.fail)
})

test('test invalid jwt', (t) => {
  t.plan(1)

  verify('fakejwt')
    .then(t.fail)
    .catch(t.pass)
})
