var test = require('tape')
var sinon = require('sinon')
var extensions = require('../../src/extensions/registry')

const MODULE_STUB = {
  vendor: 'test',
  id: 'test',
  stages: [
    {id: 'wow'}
  ]
}

test('resolve()', function(t) {
  var spy = sinon.spy(extensions, 'register')

  extensions.resolve(process.cwd() + '/node_modules/sinon')

  t.ok(spy.called, 'invokes register()')

  spy.restore()

  t.end()
})

test('register() ', function(t) {
  extensions._extensions = {}
  extensions.register(MODULE_STUB)

  t.ok(extensions._extensions.test.test, 'set module to internal _extensions prop')
  t.end()
})

test('validate()', function(t) {
  t.skip(false, 'uses validator module')
  t.end()
})

test('get()', function(t) {
  t.ok(extensions.get('test.test.stages.wow'), 'resolves extension path')
  t.throws(() => {
    extensions.get('wrong.test')
  }, 'throws path error for undefined extension paths')
  t.end()
})

