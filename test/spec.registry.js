var test = require('tape')
var sinon = require('sinon')
var extensions = require('../src/extensions/registry')

test('load()', function (t) {
  t.plan(1)
  t.true(Array.isArray(extensions.load()), 'returns array')
  t.end()
})

test('resolve()', function (t) {
  sinon.spy(extensions, 'register')

  extensions.resolve(process.cwd() + '/node_modules/sinon')

  t.plan(1)
  t.true(extensions.register.calledOnce, 'calls register()')
  extensions.register.restore()

  t.end()
})

test('register() ', function (t) {
  extensions._extensions = []
  extensions.register({})

  t.plan(1)
  t.equal(extensions._extensions.length, 1, 'set module to internal _extensions prop')
  t.end()
})

test('validate()', function (t) {
  t.plan(1)
  // t.ok(false, 'calls vaildator')
  t.end()
})

test('get()', function (t) {
  extensions.register({
    name: 'test'
  })

  t.plan(1)
  t.true(extensions.get('test'), 'Returns test extension')
  t.end()
})

test('getType()', function (t) {
  t.plan(1)
  // t.ok(false, 'returns type')
  t.end()
})
