'use strict'

let test = require('tape')
let sinon = require('sinon')
let registry = require('../../src/extensions/registry')

const MODULE_STUB = {
  vendor: 'test',
  id: 'test',
  stages: [
    {id: 'wow'}
  ]
}

test('registry.resolve()', (t) => {
  let spy = sinon.spy(registry, 'register')

  registry.resolve(process.cwd() + '/node_modules/sinon')

  t.ok(spy.called, 'invokes register()')
  spy.restore()
  t.end()
})

test('registry.reload()', (t) => {
  t.skip('reloads')
  t.end()
})

test('registry.register() ', (t) => {
  registry._extensions = {}
  registry.register(MODULE_STUB)

  t.ok(registry._extensions.test.test, 'set module to internal _extensions prop')
  t.end()
})

test('registry.registerStageTypes()', (t) => {
  t.skip('register stage type')
  t.end()
})

test('registry.registerLogTypes()', (t) => {
  t.skip('register log type')
  t.end()
})

test('registry.validate()', (t) => {
  t.skip(false, 'uses validator module')
  t.end()
})

test('registry.get()', (t) => {
  t.ok(registry.get('test.test.stages.wow'), 'resolves extension path')
  t.throws(() => {
    registry.get('wrong.test')
  }, 'throws path error for undefined extension paths')
  t.end()
})

test('registry.getStageTypes()', (t) => {
  t.skip('get stage type')
  t.end()
})
