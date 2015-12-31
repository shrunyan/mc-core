'use strict'

var test = require('tape')
var parseParams = require('../../src/api/controllers/util/parse-params')

test('parseParams()', function(t) {

  let params = {
    a: 'wow',
    b: '2',
    c: {
      sub: 'yup',
      more: 'yeah'
    },
    d: {
      even: {
        deeper: '1'
      }
    }
  }

  let result = parseParams(params)

  t.equal(result.a, 'wow')
  t.equal(result.b, '2')
  t.equal(result.c, '{"sub":"yup","more":"yeah"}')
  t.equal(result.d, '{"even":{"deeper":"1"}}')

  t.end()
})
