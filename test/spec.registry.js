var test = require('tape')
var extensions = require('../src/extensions/registry')

test('load() returns an array', function (t) {
  t.plan(1)
  t.true(Array.isArray(extensions.load()), 'returned array')
  t.end()
})

test('load() returned array contains objects', function (t) {
  t.plan(1)

  var exts = extensions.load()

  t.equal

  t.end()
})

test('register() sets module to internal _extensions prop', function (t) {
  t.plan(1)

  t.end()
})

test('validate() calls vaildator', function (t) {
  t.plan(1)

  t.end()
})

test('getType() returns type', function (t) {
  t.plan(1)

  t.end()
})
