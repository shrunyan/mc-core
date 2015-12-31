'use strict'

let connection = require('../../db/connection')
let logger = require('tracer').colorConsole()
let parseParams = require('./util/parse-params')

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
   * Get a single item
   *
   * @param req
   * @param res
   * @param table
   */
  getOne: (req, res, table) => {
    connection.first()
      .where('id', req.params.id)
      .from(table)
      .then((item) => {
        res.send({data: item})
      })
      .catch(err => {
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
   * Patch a (single) record in a table
   *
   * @param req
   * @param res
   * @param table
   */
  patchRespond: (req, res, table) => {

    let changes = req.body

    // Don't allow ID to be changed
    if (typeof changes.id !== 'undefined') {
      delete changes.id
    }

    if (req.params.id) {
      connection
        .table(table)
        .where('id', req.params.id)
        .update(parseParams(changes))
        .then(item => {
          logger.log(item)
          res.status(200).send({message: 'Updated: ' + req.params.id})
        })
        .catch(err => {
          logger.error(err)
          res.status(500)
        })
    } else {
      res.status(400).send({message: 'No ID specified.'})
    }
  },

  /**
   * Delete's ID from post body in specified table
   * @param  {Object} req   Express request
   * @param  {Object} res   Express response
   * @param  {String} table Name of table to delete record from
   * @return {Object}       Response body
   */
  deleteRespond: (req, res, table) => {
    if (req.params.id) {
      connection
        .table(table)
        .where('id', req.params.id)
        .del()
        .then(item => {
          if (item) {
            res.status(200).send({message: 'Deleted: ' + req.params.id})
          } else {
            res.status(404).send({message: 'No record for: ' + req.params.id})
          }
        })
        .catch(err => {
          logger.error(err)
          res.status(500)
        })
    } else {
      res.status(400).send({message: 'No ID specified.'})
    }
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
