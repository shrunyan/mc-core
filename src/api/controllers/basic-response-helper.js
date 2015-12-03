'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()

module.exports = {

  /**
   * A basic list of items lookup and response
   *
   * @param req
   * @param res
   * @param table
   */
  getList: (req, res, table) => {
    connection.select().from(table).then((items) => {
      res.send({data: items})
    }).catch(err => {
      logger.error(err)
      res.status(500).send({message: 'An error occurred.'})
    })
  },

  /**
   * A basic lookup with extra query builder modifications
   *
   * @param {object} req
   * @param {object} res
   * @param {string} table
   * @param {function} queryModifications
   */
  getListCustom: (req, res, table, queryModifications) => {

    let query = connection.select()

    // Apply query modifications
    query = queryModifications(query)

    // continue the query as usual
    query.from(table).then(items => {
      res.send({data: items})
    }).catch(err => {
      logger.error(err)
      res.status(500).send({message: 'An error occurred.'})
    })
  },

  /**
   * Basic insert and returns the new object
   *
   * @param req
   * @param res
   * @param table
   */
  insertRespond: (req, res, table) => {

    // Create a new object from the incoming data
    let item = req.body

    // Protect the ID field by not allowing the user to specify it
    delete item.id

    // Add metadata fields automatically
    item.created_at = new Date()
    item.updated_at = new Date()

    connection.insert(item, 'id').into(table).then((id) => {

      connection.table(table).where('id', id).first().then((item) => {
        res.status(201).send({data: item})
      }).catch(err => {
        logger.error(err)
        res.status(500).send({message: 'An error occurred.'})
      })

    }).catch(err => {
      logger.error(err)
      res.status(500).send({message: 'An error occurred.'})
    })
  }
}
