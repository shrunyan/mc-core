var knex = require('knex')
var test = require('tape')
// var sinon = require('sinon')
var connection = require('../../src/db/connection')

console.log(connection)

test.skip('connection module', function(t) {
  t.ok(connection instanceof knex, 'returns a module')
  t.end()
})
