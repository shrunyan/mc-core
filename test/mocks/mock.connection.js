'use strict'

/**
 * Mock for the 'connection' module
 * @type {Object}
 */
let connection = {
  // TODO setup mysql lite instance?
  // this would allow for actually DB transactions
  // might not be desirable from the unit test perspective
  select: query => connection,
  from: query => connection,
  then: cb => {
    cb()
    return connection
  },
  catch: cb => {
    cb()
    return connection
  }
}

module.exports = connection
