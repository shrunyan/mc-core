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
    .then(decode => {
      if (decoded.user_id === 'undefined') {
        t.fail('decoded user_id not found')
      }
      if (decoded.user_id !== TEST_USER_ID) {
        t.fail('decoded user_id does not match expectation')
      }
      t.pass()
    })
    .catch(() => {
      t.fail('an error occurred validating and decoding the jwt')
    })
})

// test('test invalid jwt', function(t) {
//   t.plan(1)

//   verify('fakejwt')
//     .then((decoded) => {
//       console.log('DECODED', decoded)
//       t.fail('this should have been an invalid jwt')
//     })
//     .catch(() => {
//       t.pass('the jwt was not validated')
//     })
// })






// test('create, validate, and decode valid jwt', function(t) {

//   t.plan(1)

//   const TEST_USER_ID = 12

//   let providedJwt = createJwt(TEST_USER_ID)

//   validateAndDecodeJwt(providedJwt)
//     .then((decoded) => {

//       if (decoded.user_id === 'undefined') {
//         t.fail('decoded user_id not found')
//         return
//       }

//       if (decoded.user_id !== TEST_USER_ID) {
//         t.fail('decoded user_id does not match expectation')
//         return
//       }

//       t.pass()

//     })
//     .catch(() => {
//       t.fail('an error occurred validating and decoding the jwt')
//     })

// })

// test('test invalid jwt', function(t) {

//   t.plan(1)

//   validateAndDecodeJwt('fakejwt')
//     .then((decoded) => {
//       t.fail()

//     })
//     .catch(() => {
//       t.pass('the jwt was not validated')
//     })

// })

// test('test valid jwt with invalid alg', function(t) {

//   t.plan(1)

//   const TEST_USER_ID = 12
//   let providedJwt

//   try {
//     // Testing with HS512 here. Not necessarily insecure, but rather testing that a single algorithm is enforced.
//     providedJwt = jwt.sign({user_id: TEST_USER_ID}, process.env.SECRET_KEY, {algorithm: 'HS512'})

//   } catch (err) {
//     t.fail('JWT signing failed')
//     return
//   }

//   validateAndDecodeJwt(providedJwt)
//     .then(() => {
//       t.fail('the jwt was validated when it shouldn\'t have been')
//     })
//     .catch(() => {
//       t.pass('the jwt was not validated')
//     })

// })
