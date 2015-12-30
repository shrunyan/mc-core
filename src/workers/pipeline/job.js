'use strict'

const FAILED = 'failed'
const SUCCEEDED = 'succeeded'

let domain = require('domain')
let logger = require('tracer').colorConsole()
let Pipeline = require('../../core/pipelines/pipeline')
let Stage = require('../../core/pipelines/stage')
let registry = require('../../extensions/registry')
let pipelineEvent = require('../../queues/pipeline/events') // Syntax: pipelineEvent('update')


module.exports = class Job {

  /**
   * @param {object} msg Data passed from the queue
   * @param {function} next Should be called on complete (to clear the message from the queue)
   */
  constructor(msg, next) {
    this.next = next
    this.pipeline = new Pipeline(msg.id)
    this.start()
  }

  start() {

    // Mark the pipeline as running
    Promise.resolve(this.pipeline.running())

    // Get the initial pipeline data

    // Load up the stages...
    // Set up a callback for when all the stages are complete...
    // Run each stage, and when the stage is done, move onto the next one...
    // ... unless it is the last one, in which case, call that callback and be done with the pipeline...

  }

}
